/*
 * File: index.js
 * Project: porton-health-api
 * File Created: Saturday, 30th May 2020 6:09:48 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Wednesday, 24th June 2020 6:31:02 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
const Mailer = require('../Mailer');

class SMTPMailer extends Mailer {}

module.exports = SMTPMailer;
