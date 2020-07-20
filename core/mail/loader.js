/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 30th May 2020 6:27:02 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 11:25:08 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

/**
 * Load the mail driver
 * A driver must be a class and must have
 * - Dependency getter or property that returns an array of dependencies
 * - load() method that is called to load the driver into memory and return a promise
 * - send() method to send email. it reads it arguments from arguments and return a promise
 */

const { getDriver, installModules } = use('support');
const fs = require('fs');

let driver;
try {
    driver = getDriver('mail');
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

        // Create email view directories
        const templateDir = config('mail.template_dir');

        if (templateDir && !fs.existsSync(templateDir)) {
            fs.mkdirSync(templateDir, { recursive: true });
        }

        Promise.resolve(true);
    };
