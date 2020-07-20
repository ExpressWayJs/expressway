/*
 * File: index.js
 * Project: expressway
 * File Created: Monday, 20th July 2020 11:07:09 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 1:13:45 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
const path = require('path');
global.expresswayRoot = path.join(__dirname, '/');
module.exports = require('./expressway');
