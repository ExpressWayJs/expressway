/*
 * File: CacheCrud.js
 * Project: @expresswayjs/expressway
 * File Created: Friday, 31st July 2020 9:57:53 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 24th October 2020 3:43:24 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const CacheModel = require('./CacheModel');
const CrudManager = use('/database/CrudManager');

class CacheCrud extends CrudManager {
    Model = CacheModel;
}

module.exports = CacheCrud;
