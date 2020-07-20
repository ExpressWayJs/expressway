/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 2nd May 2020 8:48:50 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 11:25:08 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const { getDriver } = use('support');

// Get the default driver relative to this folder
// Support a driver placement relative to appRoot for now
// Third party driver to come later
let driver;
try {
    driver = getDriver('database');
} catch (error) {
    console.log(error);
    process.exit();
}

// No database specified just return an empty function
if (!driver) module.exports = () => Promise.resolve(true);
else
    module.exports = () => {
        return require(`${driver.driverPath}`)();
    };
