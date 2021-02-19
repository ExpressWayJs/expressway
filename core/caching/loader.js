/*
 * File: loader.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 9:05:58 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 4:03:43 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */
const { getDriver, installModules } = require('../../support');
// defaultCacheConfig = require('./default-config')
let driver;
try {
    driver = getDriver('caching', null, false);
} catch (error) {
    console.log(error);
    process.exit();
}

// No database specified just return an empty function
if (!driver) module.exports = () => Promise.resolve(true);
else
    module.exports = async () => {
        const Driver = require(`${driver.driverPath}`);

        let mailDriver = new Driver(),
            dependencies = mailDriver.dependencies;

        if (dependencies) {
            await installModules(dependencies);
        }

        Promise.resolve(true);
    };
