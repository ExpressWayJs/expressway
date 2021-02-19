/*
 * File: caching.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 2:51:21 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 3:38:28 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

module.exports = {
    // database, redis, memory
    default: null,

    // Time to Live In seconds
    // Default to 12 hours
    ttl: 60 * 60 * 12,

    database: {
        table: '_cache',
        connection: 'default',
    },
};
