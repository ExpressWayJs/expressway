/*
 * File: config.js
 * Project: porton-health-api
 * File Created: Friday, 31st July 2020 10:46:46 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 31st July 2020 10:47:09 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

module.exports = {
	// database, redis, memory
	default: 'database',

	// Time to Live In seconds
	// Default to 12 hours
	ttl: 60 * 60 * 12,

	database: {
		table: '_cache',
		connection: 'default',
	},
};
