/*
 * File: index.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 10:44:40 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 24th October 2020 3:42:15 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const path = require('path'),
    { config } = use('/support/globals');
require('colors');
let cacheBackend = config('caching.default', require('./config').default);

cacheBackend = cacheBackend || 'database';

try {
    module.exports = require(path.join(__dirname, cacheBackend));
} catch (error) {
    console.error(`${cacheBackend} cache driver not found`.white.bgRed, error);
}
