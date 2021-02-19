/*
 * File: CrudManager.js
 * Project: @expresswayjs/expressway
 * File Created: Thursday, 16th July 2020 5:44:41 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 4:48:03 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

const _ = require('lodash');
const { decryptModel } = use('/support');

/**
 * A base class to perform crud operations
 * This class must be implemented as an abstract class
 */
class CrudManager {
    /**
     * @var Model The model to use for the crud operation
     */
    Model = null;

    /**
     * The id key used by the database engine
     */
    idKey = '_id';

    /**
     * @var queryLimit The limit to use with crud
     */
    queryLimit = 20;

    /**
     * @var queryPage The crud cursor page
     */
    queryPage = 1;

    /**
     * @var queryFilter The filter object for this operation
     */
    queryFilter = null;

    /**
     * @var querySort The sort mechanism
     */
    querySort = [
        ['createdAt', 'desc'],
        ['_id', '1'],
    ];

    /**
     * @var objects The internal object(s) fetched
     */
    objects = null;

    /**
     * @var model the model to store or update
     */
    model = null;

    /**
     * @var rawData The raw data payload recieved
     */
    rawData = null;

    /**
     * Apply this filter to all the get operations
     */
    get read_filters() {
        return {};
    }

    constructor(data = null) {
        if (!data) return;
        this.rawData = data;
    }

    new() {
        this.model = new this.Model(this.rawData);
    }

    /**
     * Merge the read_filters with the new filters
     *
     * @param {object} filter The new filters
     */
    mergeFilters(filter) {
        if (filter && typeof filter !== 'object')
            throw new TypeError('Filter must be an object');

        if (this.queryFilter === null) {
            this.queryFilter = { ...this.read_filters };
        }

        if (filter) {
            this.queryFilter = { ...this.queryFilter, ...filter };
        }

        return this;
    }
    /**
     * Chainable Filter get query
     * @param {object} filter The filter for a get query
     */
    where(filter) {
        if (filter) this.mergeFilters(filter);
        return this;
    }

    /**
     * Chainable query limit
     * @param {int} l Limit to set
     */
    limit(l) {
        if (l) this.queryLimit = l;

        return this;
    }

    /**
     * Chainable query skip page
     * @param {int} p the page
     */
    page(p) {
        if (p) this.queryPage = p;

        return this;
    }

    /**
     * Chainable sort
     * @param {any} s The sort mechanism
     */
    sort(s) {
        if (s) this.querySort = s;

        return this;
    }

    processCollection() {
        const processPromises = this.objects.map(async (entry) => {
            return this.processObject(entry);
        });

        return Promise.all(processPromises);
    }

    /**
     * Get a single model as is from the database and process it somehow
     * Becuase this might be an asyncronous task from the child object
     * It is best to fersee it as a promise so it must return a promise
     *
     * @param {object} object The model
     * @return {Promise}
     */
    processObject(obj) {
        const decrypt = decryptModel(obj.toObject());
        return Promise.resolve(decrypt || obj);
    }

    /**
     * Get paginated models
     * @param {object} filter 	The filter to use when selecting
     * @param {int} limit		Pagination limit
     * @param {int} page		Pagination page
     * @return {object|null} 	List of paginated providers
     */
    async get(filter = {}, limit = null, page = null) {
        this.mergeFilters(filter || {})
            .limit(limit)
            .page(page);

        this.objects = await this.Model.get(this.queryFilter)
            .limit(this.queryLimit)
            .skip(this.queryPage == 1 ? 0 : this.queryLimit * this.queryPage)
            .sort(this.querySort);

        if (!this.objects) return null;

        return this.processCollection();
    }

    /**
     * Find a single model
     * @param {object} filter The filter to find with
     * @param {bool} process If to process the data
     * @return {object|null}
     */
    async find(filter = {}, process = true) {
        this.mergeFilters(filter || {});

        this.model = await this.Model.find(this.queryFilter);

        if (!this.model.exists()) return null;

        if (process) return await this.processObject(this.model);

        return this.model;
    }

    /**
     * Find a single model by id
     * @param {object} id The id of the model
     * @param {bool} process If to process the data
     * @return {object|null}
     */
    findById(id, process = true) {
        return this.find(
            {
                [this.idKey]: id,
            },
            process
        );
    }

    /**
     * Model creation factory
     * @param {object} data creation data
     *
     * @return {object}
     */
    create(data) {
        this.rawData = data;
        this.new(data);
        return this.save();
    }

    /**
     * Perform some actions before saving the model
     * This is called before any model beforeSave
     *
     * @return {Promise}
     */
    beforeSave() {
        return this;
    }

    /**
     * Perform some actions after saving the model
     *
     * @return {Promise}
     */
    afterSave() {
        return this;
    }

    /**
     * Perform some actions before updating the model
     *
     * @return {Promise}
     */
    beforeUpdate() {
        return this;
    }

    /**
     * Perform some actions after updating the model
     *
     * @return {Promise}
     */
    afterUpdate() {
        return this;
    }

    /**
     * Perform some actions before deleting the model
     *
     * @return {Promise}
     */
    beforeDelete() {
        return this;
    }

    /**
     * Perform some actions after deleting the model
     *
     * @return {Promise}
     */
    afterDelete() {
        return this;
    }

    /**
     * Persist the model into the database
     *
     * @return {bool}
     */
    async save() {
        await this.beforeSave();

        await this.model.save();

        try {
            this.afterSave();
        } catch (error) {
            // Rollback
            this.model.delete();
            throw error;
        }

        return await this.processObject(this.model);
    }

    /**
     * Update an object
     *
     * @param {object} data The data to override with
     * @param {string} id The id of the object to update
     */
    async update(data, id = null) {
        if (!id) id = data[this.idKey];

        if (typeof data !== 'object')
            throw new TypeError('Update data must be an object');

        const noModelMessage = 'Cannot find entry to update';

        if (!id) throw new ReferenceError(noModelMessage);

        await this.findById(id, false);

        if (!this.model.exists()) {
            throw new ReferenceError(noModelMessage);
        }

        this.rawData = this.model.toObject();

        this.model.set(data);
        await this.beforeUpdate();
        await this.model.save();

        try {
            await this.afterUpdate();
        } catch (error) {
            // Rollback
            this.model.set(this.rawData);
            this.model.save();
            throw error;
        }

        return await this.processObject(this.model);
    }

    /**
     * Delete an object
     *
     * @param {string} id The id of the object to delete
     * @return {bool}
     */
    async delete(id) {
        await this.findById(id, false);

        if (!this.model.exists()) {
            throw new ReferenceError('Object not found');
        }

        this.rawData = this.model.toObject();

        await this.beforeDelete();
        try {
            await this.model.delete();
        } catch (error) {
            return false;
        }

        try {
            await this.afterDelete();
        } catch (error) {
            // Who cares, object is gone
        }

        return true;
    }
}

module.exports = CrudManager;
