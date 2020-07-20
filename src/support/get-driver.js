/*
 * File: get-driver.js
 * Project: porton-health-api
 * File Created: Saturday, 30th May 2020 5:48:46 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Wednesday, 24th June 2020 7:59:07 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
const path = require('path');
const fs = require('fs');
require('colors');

/**
 * Load the default module driver
 * @param {string} feature   The system feature/module e.g database
 * @param {string} engine 	The module backend (mongodb, mysql, smtp etc)
 * @param {boolean} noCache Dont load engine from the cache;
 */
const getDriver = (feature, engine = null, noCache = false) => {
	const backend = config(`${feature}.default`);

	// No module specified
	if (!engine && !backend) {
		return false;
	}
	if (global[`${engine || backend}_${feature}_driver`] && !noCache) {
		// Return a cached copy of the module driver
		// Set noCache to true to repull
		return global[`${engine || backend}_${feature}_driver`];
	}

	// Load the configuration
	const backendConfig = config(`${feature}.${engine || backend}`);
	if (!backendConfig) {
		const message = `${
			engine || backend
		} ${feature} configuration not found, please open config/${feature}.js and set the ${
			engine || backend
		} option`;
		console.log(message.white.bgRed);
		throw new ReferenceError(message);
	}
	try {
		if (backendConfig.driver) {
			// If the driver path is explicity provided
			if (
				!fs
					.lstatSync(
						path.join(
							'src/',
							backendConfig.driver.replace(/\./g, '/')
						)
					)
					.isDirectory()
			)
				throw new Error();
		} else {
			backendConfig.driver = `core.${feature}.${engine || backend}`;
		}

		// Set the driver path
		backendConfig.driverPath = path.join(
			appRoot,
			backendConfig.driver.replace(/\./g, '/')
		);

		global[`${engine || backend}_${feature}_driver`] = backendConfig;

		return backendConfig;
	} catch (error) {
		console.error(
			`${engine || backend} ${feature} driver not found`.white.bgRed,
			error
		);
		process.exit();
	}
};

module.exports = getDriver;
