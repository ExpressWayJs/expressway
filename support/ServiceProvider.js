/*
 * File: ServiceProvider.js
 * Project: @expresswayjs/expressway
 * File Created: Thursday, 23rd July 2020 11:43:04 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:34:29 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

const { app } = require('../core/bootstrap/app');

class ServiceProvider {
    // We need the app instance here, but we will come back to it in
    // @expresswayjs/expressway

    app = null;

    constructor(contextApp = null) {
        this.app = contextApp || app;
    }

    // Put all the task to load here
    boot() {
        console.log('Loaded');
    }

    // I dont know yet
    register() {}
}

module.exports = ServiceProvider;
