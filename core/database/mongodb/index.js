/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 2nd May 2020 8:42:28 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 11:25:08 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const mongoose = require('mongoose');
const { getDriver } = use('/support');

const driver = getDriver('database', 'mongodb');
module.exports = async () => {
    try {
        mongoose.set('useNewUrlParser', driver.options.useNewUrlParser || true);
        mongoose.set(
            'useUnifiedTopology',
            driver.options.useUnifiedTopology || true
        );
        mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
            global.mongooseModels = {};
        });
        const mg = await mongoose.connect(
            driver.connection_string,
            driver.oprions
        );
        mg.connection.on('error', console.error);
    } catch (error) {
        console.error(error);
    }
};
