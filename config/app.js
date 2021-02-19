/*
 * File: app.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 2nd May 2020 4:45:39 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 3:35:24 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

module.exports = {
    // App key used for signing cookies and authentications
    // Please generate an app key yourself in the environment variable
    // Very Important
    key: env('APP_KEY', 'some_generated_key_of_sort=='),

    // The application environment
    // Use [local] for development
    // Use [production] or anything you like for production
    env: env('NODE_ENV', 'production'),

    debug: env('APP_DEBUG', false),

    // The port the server run on
    port: env('PORT', 3000),

    // Where to load static files
    // Set to false to disable static files
    static_dir: 'public',

    // Log request to the console when NODE_ENV is local
    log_request: true,

    // API query pagination limit
    api_query_limit: 20,

    /**
     * These are the modules the framework should load
     * you can use the string representation of the core modules
     * or a dot/slash notation of the module path
     */
    modules: ['mail', 'database', 'caching'],

    /**
     * Facaded are a fluent way to load a class
     * To make a class/module available globally as a facade,
     * Add it to the below list
     * The facade name is the key
     * module can be dot/slash notation
     */

    facades: {},

    /**
     * If to autoload all service providers in the app/providers directory
     */
    autoload_providers: true,

    /**
     * Service providers are a way to hook functionalities into the core
     * at boot time or perform a quick one time task
     */

    providers: [],

    /**
     * Local https server
     * Setup server to listen to both http and https
     */

    use_local_https: env('HTTPS', false),

    /**
     * Local https configurations
     * this is passed directly to nodes https module
     * files are relative to application root which is the src folder
     *
     * on unix with OpenSSL create both files with this oneliner
     * openssl req -x509 -newkey rsa:4096 -sha256 -days 3560 -nodes -keyout server.key -out server.crt \
     * -subj /CN=domain.my -extensions san -config <(echo '[req]'; \
     * echo 'distinguished_name=req'; echo '[san]'; echo 'subjectAltName=DNS:domain.my')
     *
     * Knock yourself out on windows
     */
    local_https: {
        key: null,
        cert: null,
    },
};
