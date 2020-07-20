/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 30th May 2020 5:30:54 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 3:34:43 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
const { config } = require('./globals');
/**
 * Compose an API JSON object
 * @param {bool} status Status true or false
 * @param {Object} data Extra object to send
 * @param {string} message The failure message
 */
const response = (status = true, data = null, message = null) => {
    let resp = {
        status,
        message: message || 'Request Successful',
    };
    if (data) {
        if ((data.data && Array.isArray(data.data)) || Array.isArray(data)) {
            resp.data_count = data.data ? data.data.length : data.length;
        }
        resp['data'] = mongoExtract(data);
    }
    return resp;
};

/**
 * Check if the data is a mongodb data and extract plain json
 * @param {object} data 	The data to extract
 * @param {bool} resetId	change _id to id
 *
 * @return {object}
 */
const mongoExtract = (data, resetId = false) => {
    const Document = require('mongoose').Document;
    const doExtract = (datum) => {
        try {
            // if (data._doc || data.$__) {
            if (datum instanceof Document) {
                datum = datum._doc;
            }

            if (resetId && datum._id !== undefined) {
                datum.id = datum._id;
                delete datum._id;
            }

            delete datum.__v;

            return datum;
        } catch (error) {
            return datum;
        }
    };

    if (Array.isArray(data)) {
        return data.map((d) => doExtract(d));
    }

    return doExtract(data);
};

/**
 * Create an API success object
 *
 * @param {Object} data Extra object to send
 * @param {string} message The failure message
 */
const successJson = (data, message) => {
    return response(true, data, message);
};

/**
 * Create an API failure object
 * @param {string} message The failure message
 * @param {Object} data Extra object to send
 */
const failJson = (message, data = null) => {
    return response(false, data, message);
};

const paginatedResponse = (data, request, message) => {
    let baseUrl = `${request.protocol}://${request.get(
            'host'
        )}${request.originalUrl.split('?')[0].replace(/\/$/, '')}`,
        limit = request.queryLimit;
    page = request.query.page || 1;
    pagination = {
        base_url: baseUrl,
        limit,
        page,
    };

    // A guess work not really suitable
    if (data.length == limit) {
        pagination.next_url = `${baseUrl}/?limit=${limit}&page=${page + 1}`;
    }

    if (page > 1) {
        pagination.prev_url = `${baseUrl}/?limit=${limit}&page=${page - 1}`;
    }

    return response(
        true,
        {
            pagination,
            data: mongoExtract(data),
        },
        message
    );
};

/**
 * Check if is class or function
 * https://zaiste.net/javascript_is_it_a_class_or_a_function/
 * @param {func} func
 */
const isClass = (func) => {
    return (
        typeof func === 'function' &&
        /^class\s/.test(Function.prototype.toString.call(func))
    );
};

/**
 * Get external endpoint by name
 * @param {string} name The endpoint to get
 * @return {URL} url to the endpoint
 */
const getExternalEndpoint = (name) => {
    const providerEndpoint = config(`api.${name}`);

    if (!providerEndpoint) {
        throw new ReferenceError('The api endpoint is not available');
    }

    // Will throw error if URL is not a valid url
    const url = new URL(providerEndpoint);
    url.endpoint = url.href.replace(/\/$/, '');

    return url;
};

/**
 * Decrypt the mongodb data
 * @param {object} mongodb
 */
const decryptModel = (obj) => {
    const { decrypt } = require('./crypt');
    const encryptedKeys = Object.keys(obj).filter((o) => o.match(/_enc$/));
    if (encryptedKeys.length) delete obj._encrypted;

    encryptedKeys.forEach((key) => {
        if (obj.hasOwnProperty(key)) {
            let noEncrytKey = key.replace(/_enc$/, '');
            try {
                obj[noEncrytKey] = decrypt(obj[key]);
                delete obj[key];
            } catch (error) {
                // Noting happend
            }
        }

        if (obj.services) {
            delete obj.services.password;
            delete obj.services.resume;
        }
    });

    return obj;
};

module.exports = {
    response,
    successJson,
    failJson,
    paginatedResponse,
    mongoExtract,
    isClass,
    getExternalEndpoint,
    decryptModel,
    getDriver: require('./get-driver'),
    installModules: require('./install-modules'),
    facade: require('./facade'),
    crypt: require('./crypt'),
};
