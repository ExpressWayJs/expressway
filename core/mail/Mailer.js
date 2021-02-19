/*
 * File: facade.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 30th May 2020 6:28:03 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:24:56 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

const fs = require('fs');
const path = require('path');

/**
 * Send Email with SMTP or SES using nodemailer
 */
class Mailer {
    mailer;
    nodemailer;
    mailConfig;
    suppressError;
    testEmail;
    viewDir;
    mailObject;
    htmlTemplate;
    locals;

    /**
     * Send email with SMTP or SES using nodemailer
     * @param {object} mailConfig The default mail object
     */
    constructor(mailConfig) {
        this.defaultFrom = config('mail.default_from');
        this.suppressError = config('mail.suppress_error', false);
        this.testEmail = config('mail.test', false);
        this.viewDir = config('mail.template_dir');

        this.mailConfig = config(
            `mail.${this.driver || config('mail.default')}`,
            null
        );
        if (mailConfig) this.mailObject = mailConfig;
    }
    /**
     * List of dependencies required
     *
     * @return {Array} Array of dependencies that are auto-installed
     */
    get dependencies() {
        let dep = ['nodemailer', 'pug'];

        if (this.driver == 'ses') {
            dep.push('aws-sdk');
        }

        return dep;
    }

    /**
     * The default driver to use
     * By the way you can set it here explicity in child classes
     *
     * @return {string} the mail config
     */
    get driver() {
        return config('mail.default');
    }

    /**
     * Load the mail function into memory
     * This is lazy loaded until the email is needed
     * @return {Mailer} Self
     */
    async load() {
        const transporterName = `${this.driver}_mailer`,
            nodemailer = require('nodemailer');
        this.nodemailer = nodemailer;
        if (global[transporterName]) {
            // global[transporterName];

            this.mailer = global[transporterName];
        } else {
            if (!this.mailConfig)
                throw new ReferenceError('SMTP configuration not found');

            if (this.testEmail) {
                let testAccount = await this.nodemailer.createTestAccount();
                this.mailConfig = {
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                    },
                };
            }

            if (this.mailConfig.auth) {
                const { user, pass } = this.mailConfig.auth;

                if (!user) delete this.mailConfig.auth.user;
                if (!pass) delete this.mailConfig.auth.pass;
            }

            let transporter = this.nodemailer.createTransport(this.mailConfig);

            global[transporterName] = transporter;

            this.mailer = transporter;
        }

        return this;
    }

    /**
     * Compile the html message to string using pug
     *
     * @throws {ReferenceError}
     * @return {Mailer} Self
     */
    compile() {
        const pug = require('pug'),
            pugFile = path.join(this.viewDir, `${this.htmlTemplate}.pug`);
        if (!fs.existsSync(pugFile)) {
            console.log('Mail file does not exist');
            if (!this.suppressError)
                throw new ReferenceError('Mail file does not exist');
            return;
        }

        const compile = pug.compileFile(pugFile);

        this.mailObject.message = compile(this.locals);

        return this;
    }

    /**
     * Send an email from a template with locals
     * @param {string} file The mail file, should be relative to mail.template_dir
     * @param {object} locals The local context passed to the file
     *
     * @return {object|bool} The mail information
     */
    async sendFromTemplate(file, locals = {}) {
        this.htmlTemplate = file;
        this.locals = locals;

        this.compile(file, locals);
        return await this.send();
    }

    /**
     * Verify that the email setting is correct
     *
     * @return {Promise}
     */
    async verify() {
        await this.load();
        const that = this;
        return new Promise((resolve, reject) => {
            this.mailer.verify(function (error) {
                if (error) {
                    console.log(error);
                    if (that.suppressError) resolve(false);
                    else reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Convert the reciepients to array (if they are not)
     * by splitting with space and comma
     * then check if all email are valid
     * returns boolean if all email is correct or throws an error
     *
     * @throws {Error}
     * @return {bool}
     */
    checkRecipients() {
        if (!Array.isArray(this.mailObject.to)) {
            // Split the to with space and comma and make it an array
            this.mailObject.to = this.mailObject.to.split(/\s|\,/g);
        }

        // Now check if email is valid
        this.mailObject.to = this.mailObject.to.filter((email) => {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                if (!this.suppressError) {
                    throw new Error(
                        `One or more of the email provided is invalid. Example: ${email}`
                    );
                } else {
                    // Just delete the email from the array
                    return false;
                }
            }

            return true;
        });

        if (!this.mailObject.to.length) {
            return false;
        }

        return true;
    }

    /**
     * Send the email over the transport
     *
     * @param {object} mailObject	Additional mail information to override the default
     * @return {object|bool} The mail information
     */
    async send(mailObject = {}) {
        if (mailObject) this.mailObject = { ...this.mailObject, ...mailObject };

        if (!this.checkRecipients()) {
            console.log('No valid reciepient provided');
            return false;
        }

        let { from, to, subject, message } = this.mailObject;

        if (!to || !message) {
            console.log('The to and message parameters are required');
            if (!this.suppressError)
                throw new ReferenceError('The to and message is required');
            return false;
        }

        if (!from) from = this.defaultFrom;

        try {
            await this.load();

            // return this.mailConfig;

            const doSend = await this.mailer.sendMail({
                from,
                to,
                subject: subject || `New Email From ${from}`,
                // text: message,
                html: message,
            });

            let info = doSend;

            if (this.testEmail) {
                const mailPreviewUrl = this.nodemailer.getTestMessageUrl(
                    doSend
                );

                console.log(`Test mail preview: ${mailPreviewUrl}`);
                info = {
                    ...info,
                    id: doSend.messageId,
                    url: mailPreviewUrl,
                };
            }

            return info;
        } catch (error) {
            console.log(error);
            if (!this.suppressError) throw error;
            return false;
        }
    }
}

module.exports = Mailer;
