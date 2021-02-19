/*
 * File: facade.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 2nd May 2020 9:15:42 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:25:11 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

const path = require('path');
const fs = require('fs');
require('colors');
const dbBackend = config('database.default');

/**
 * Load the default database driver
 *
 * @param {string} engine 	The database backend (mongodb, mysql etc)
 * @param {boolean} noCache Dont load engine from the cache;
 */
exports.getDriver = (engine = null, noCache = false) => {
    // No database specified
    if (!engine && !dbBackend) {
        return false;
    }
    if (global[`${engine || dbBackend}_db_driver`] && !noCache) {
        // Return a cached copy of the database driver
        // Set noCache to true to repull
        return global[`${engine || dbBackend}_db_driver`];
    }

    try {
        const dbConfig = config(`database.${engine || dbBackend}`);
        if (dbConfig.driver) {
            if (
                !fs
                    .lstatSync(
                        path.join('src/', dbConfig.driver.replace(/\./g, '/'))
                    )
                    .isDirectory()
            )
                throw new Error();
        } else {
            dbConfig.driver = `core.database.${engine || dbBackend}`;
        }

        dbConfig.driverPath = path.join(
            appRoot,
            dbConfig.driver.replace(/\./g, '/')
        );

        global[`${engine || dbBackend}_db_driver`] = dbConfig;

        return dbConfig;
    } catch (error) {
        console.error(
            `${engine || dbBackend} database driver not found`.white.bgRed,
            error
        );
        process.exit();
    }
};
