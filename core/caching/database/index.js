/*
 * File: index.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 9:25:56 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 24th October 2020 3:44:53 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const moment = require('moment');

const BaseCache = require('../BaseCache');
let CacheCrud = require('./CacheCrud');

CacheCrud = use('/support/facade')(CacheCrud);

class DatabaseCache extends BaseCache {
    idKey = null;

    constructor() {
        super();
        const cm = new CacheCrud();
        this.idKey = cm.idKey;
    }

    getTTL(ttl = null) {
        return moment()
            .add(ttl || this.ttl, 'seconds')
            .format();
    }

    // Pull the cache from the database
    async getByKey(key) {
        const get = await CacheCrud.find({
            key,
        });

        if (!get) {
            this._data = null;
            return;
        }

        this._data = get;

        return this.processValue();
    }

    async deleteByKey(key) {
        await this.getByKey(key);
        if (this._data) await CacheCrud.delete(this._data[this.idKey]);
    }

    // Check if cache exist
    async has(key) {
        await this.getByKey(key);
        if (!this._data) return false;

        return true;
    }

    get isValid() {
        if (!this._data) return false;

        const ttl = moment(this._data.expiry),
            diff = ttl.diff(moment(), 'seconds', true);
        if (diff > this._data.ttl) {
            // Dont wait for detete
            this.deleteByKey(this._data.key);

            return false;
        }

        return true;
    }

    // Set a cache
    async set(key, value, ttl) {
        try {
            value = JSON.stringify(value);
        } catch (error) {
            // Its just a string
        }

        const check = await this.getByKey(key);

        if (check) {
            this._data = await CacheCrud.where({
                [this.idKey]: check[this.idKey],
            }).update({
                value,
                ttl: ttl || this.ttl,
                expiry: this.getTTL(ttl),
            });
        } else {
            this._data = await CacheCrud.create({
                key,
                value,
                ttl: ttl || this.ttl,
                expiry: this.getTTL(ttl),
            });
        }

        return this.processValue().value;
    }

    // Get a cache
    async get(key) {
        const check = await this.getByKey(key);
        if (!check || !this.isValid) return null;

        return this._data.value;
    }

    // Pull from the cache
    async pull(key) {
        const check = await this.getByKey(key);
        if (!check || !this.isValid) return null;

        await this.delete(key);

        return this._data.value;
    }

    // Delete from the cache
    async delete(key) {
        await this.deleteByKey(key);

        return;
    }
}

module.exports = DatabaseCache;
