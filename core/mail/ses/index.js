/*
 * File: facade.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 30th May 2020 6:09:48 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:24:56 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */
const Mailer = require('../Mailer');

class SESMailer extends Mailer {}

module.exports = SESMailer;
