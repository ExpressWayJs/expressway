/*
 * File: app.js
 * Project: expressway
 * File Created: Monday, 20th July 2020 11:53:43 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 1:11:45 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

require('./globals');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Initialize express
const expressway = require('express');

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
