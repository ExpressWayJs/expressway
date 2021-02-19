/*
 * File: globals.js
 * Project: @expresswayjs/expressway
 * File Created: Monday, 4th May 2020 9:57:54 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 24th October 2020 3:30:42 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const path = require('path');
const stackTrace = require('stack-trace');

const configCache = global.configCache || {};
global.configCache = configCache;

/**
 * cast config into the right type as nodejs process.env is string
 *
 * @param {string} value 	The value
 * @return mixed
 */
const castConfig = (value) => {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    if (value === 'null') {
        return null;
    }
    if (!isNaN(value)) {
        return Number(value);
    }

    return value;
};

global.castConfig = castConfig;

/**
 * Get a config() global
 * call config() without params to get all config
 *
 * @param {string} conf 			dot noted config
 * @param {any} defaultVal	value to use when conf is not available
 */
const config = (conf = null, defaultVal = null) => {
    if (!conf) return configCache;

    const confSplit = conf.split('.');
    if (confSplit.length == 1) return process.env[conf] || defaultVal;

    try {
        let confRecurse = configCache[confSplit[0]];
        for (let index = 1; index < confSplit.length; index++) {
            confRecurse = confRecurse[confSplit[index]];
        }

        // Recursion casting
        function parse(object) {
            for (let cr in object) {
                if (typeof object[cr] === 'string') {
                    object[cr] = castConfig(object[cr]);
                } else if (
                    typeof object[cr] === 'object' &&
                    !Array.isArray(cr)
                ) {
                    parse(object[cr]);
                }
            }
        }

        // Cast the configurations
        if (confRecurse) {
            if (typeof confRecurse === 'string') {
                confRecurse = castConfig(confRecurse);
            }
            // Cast only first level for now
            else if (
                typeof confRecurse === 'object' &&
                !Array.isArray(confRecurse)
            ) {
                parse(confRecurse);
            }
        }

        return confRecurse || defaultVal;
    } catch (error) {
        return defaultVal;
    }
};
global.config = config;

const env = (env, defaultVal = null) => {
    return process.env[env] || defaultVal;
};
global.env = env;

const use = (mPath) => {
    const { isFile, isDirectory } = require('./io');

    try {
        let modulePath = mPath,
            isRelativePath = false;

        // First search in the app itself

        // If it is a relative path
        // That is ../ or ./
        if (!/^\.{1,2}\//.test(modulePath)) {
            modulePath = path.join(appRoot, modulePath);
        } else {
            // Could be useful in the future
            isRelativePath = true;

            // Relative module loading
            modulePath = path.join(
                path.dirname(stackTrace.get()[1].getFileName()),
                modulePath
            );
        }

        modulePath = modulePath.replace(/\.js$/, '');

        if (
            (isDirectory(modulePath) &&
                isFile(`${modulePath.replace(/\/$/)}/index.js`)) ||
            isFile(`${modulePath}.js`)
        ) {
            return require(modulePath);
        } else {
            // Search in the framework
            modulePath = path.join(expresswayRoot, mPath);
            modulePath = modulePath.replace(/\.js$/, '');

            if (
                (isDirectory(modulePath) &&
                    isFile(`${modulePath.replace(/\/$/)}/index.js`)) ||
                isFile(`${modulePath}.js`)
            ) {
                return require(modulePath);
            }

            return require(mPath);
        }
    } catch (error) {
        throw error;
    }
};

global.use = use;

module.exports = {
    configCache,
    castConfig,
    config,
    env,
    use,
};
