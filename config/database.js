/*
 * File: database.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 2nd May 2020 4:24:25 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 3:38:55 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

module.exports = {
    // Default database
    // Support Mongodb for now
    // Null or false for no databse
    default: null,

    mongodb: {
        connection_string: env('DB_CONNECTION', null),
        driver: 'core.database.mongodb',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
};
