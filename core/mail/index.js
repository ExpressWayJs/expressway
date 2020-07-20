/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 30th May 2020 5:45:05 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 11:25:08 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

class Mail {
    options = {
        from: '',
        to: '',
        subject: '',
        message: '',
    };

    constructor(mailProps) {
        if (mailProps && typeof mailProps === 'object') {
            this.options = { ...this.options, ...mailProps };
        }

        const { getDriver } = use('support');
        const driver = getDriver('mail');

        if (!driver) throw new ReferenceError('Mail driver not configured');

        const Driver = require(`${driver.driverPath}`);

        this.driver = new Driver(this.options);
    }

    set(key, value) {
        this.options[key] = value;
        return this;
    }

    get(key) {
        return this.options[key];
    }

    async verify() {
        return await this.driver.verify();
    }

    async send() {
        return await this.driver.send();
    }

    async sendFromTemplate(file, locals = {}) {
        return await this.driver.sendFromTemplate(file, locals);
    }
}

module.exports = Mail;
