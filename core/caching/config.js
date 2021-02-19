/*
 * File: facade.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 10:46:46 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:24:56 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
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
