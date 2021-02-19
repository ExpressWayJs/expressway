/*
 * File: app.js
 * Project: @expresswayjs/expressway
 * File Created: Monday, 20th July 2020 11:53:43 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:09:17 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

require('../../support/globals');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Initialize express or say initialize express
const expressway = require('express');

// Keep the original version of express
// But create the express app as a property of expressway
expressway.app = expressway();

try {
    const pkg = fs.readFileSync(path.join(__dirname, '/../../package.json'));
    if (pkg) {
        expressway.VERSION = JSON.parse(pkg).version;
    }
} catch (error) {
    console.error(error);
}

module.exports = expressway;
