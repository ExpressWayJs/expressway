/*
 * File: BaseCache.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 9:47:03 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 24th October 2020 3:43:05 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const { getDriver } = use('/support');
const defaultConfig = require('./config');
const { castValue } = use('/globals');
const cacheConfig = getDriver('caching', null, false, defaultConfig);

class BaseCache {
    _data = null;
    dependencies = [];

    get config() {
        return cacheConfig;
    }

    get ttl() {
        return config('caching.ttl', defaultConfig.ttl);
    }

    get isValid() {}

    async getByKey(key) {}

    // Check if cache exist
    async has(key) {}

    // Set a cache
    async set(key, value, ttl) {}

    // Get a cache
    async get(key) {}

    // Pull from the cache
    async pull(key) {}

    // Delete from the cache
    async delete(key) {}

    processValue() {
        if (!this._data) return null;

        try {
            this._data.value = JSON.parse(this._data.value);
        } catch (error) {}

        this._data.value = castValue(this._data.value);

        return this._data;
    }
}

module.exports = BaseCache;
