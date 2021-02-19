/*
 * File: server.js
 * Project: @expresswayjs/expressway
 * File Created: Wednesday, 17th February 2021 8:20:00 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 2:17:58 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

const fs = require('fs');
const path = require('path');
const { isFile } = require('../../support/io');

/**
 * This is a tiny middleware to add https to the server if necessary
 */
module.exports = (app) => {
    if (
        !config('app.debug') ||
        !config('app.use_local_https') ||
        !config('app.local_https')
    )
        return app;

    let missingFile = false,
        localHttps = config('app.local_https');

    if (!localHttps.key || !localHttps.cert) return app;

    for (const conf in localHttps) {
        const absolutePath = path.join(appRoot, localHttps[conf]);
        if (!isFile(absolutePath)) missingFile = true;
        else localHttps[conf] = fs.readFileSync(absolutePath, 'utf8');
    }

    if (missingFile) return app;

    console.log('Registering https...');

    app.listen = (port, hostname, callback) => {
        const http = require('http'),
            https = require('https');

        const _http = http.createServer(app),
            _https = https.createServer(localHttps, app),
            httpServer = _http.listen(port, hostname, callback);
        _https.listen(443, hostname, () => {
            console.log('Also listening on port 443');
        });

        return httpServer;
    };

    return app;
};
