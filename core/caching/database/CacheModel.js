/*
 * File: CacheModel.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 9:31:32 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 24th October 2020 3:44:44 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const defaultConfig = require('/config');

const Model = use('/database/model');

const { getDriver } = use('/support');
const cacheConfig = getDriver('caching', null, false, defaultConfig);

class CacheModel extends Model {
    // For mongoDB
    get schema() {
        return {
            _id: String,
            key: String,
            value: String,
            ttl: Number,
            expiry: Date,
        };
    }

    // For mongoDB
    get schemaOptions() {
        return {
            collection: cacheConfig.table,
            strict: false,
        };
    }
}

module.exports = CacheModel;
