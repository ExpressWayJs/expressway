/*
 * File: model.js
 * Project: porton-health-third-party-api
 * File Created: Saturday, 2nd May 2020 8:42:08 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 4th May 2020 12:48:37 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const path = require('path');
require('colors');
const dbBackend = config('database.default');

try {
	module.exports = require(path.join(__dirname, dbBackend, 'Model'));
} catch (error) {
	console.error(`${dbBackend} database driver not found`.white.bgRed, error);
	process.exit();
}
