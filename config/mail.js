/*
 * File: mail.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 30th May 2020 6:01:59 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 3:41:05 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

const path = require('path');

module.exports = {
    // Default mail driver
    // Support only smtp, work is on to support ses
    // null or false for no mail
    default: env('MAIL_DRIVER', 'smtp'),

    // Suppress Error
    // Wheather to throw error when mail is not sent or ignore
    suppress_error: env('MAIL_SUPPRESS_ERROR', true),

    default_from: env('MAIL_FROM', 'someone@somewhere.com'),

    // Send to test mailbox at ethereal.email
    // Link to check email will be sent in the email response
    // Only work with SMTP
    test: env('MAIL_TEST', false),

    // Where the mail html templates are stored
    // Change only if you know what you are doing
    template_dir: path.join(appRoot, '/views/email'),

    // Compile engine for html templates
    // Only support pug for now
    template_compiler: 'pug',

    // https://nodemailer.com/smtp
    smtp: {
        // Set to IP if using localhost
        host: env('MAIL_HOST', 'smtp.ethereal.email'),
        port: env('MAIL_PORT', 587),
        // true for 465, false for other ports
        secure: env('MAIL_SECURE', false),

        // Uncomment if using mailhog or local mail systems
        // tls: {
        // 	rejectUnauthorized: false,
        // },
        // ignoreTLS: true,
        logger: env('MAIL_LOGGING', false),

        debug: env('MAIL_LOGGING', false),

        auth: {
            user: env('MAIL_USERNAME', null),
            pass: env('MAIL_PASSWORD', null),
        },
    },

    ses: {},
};
