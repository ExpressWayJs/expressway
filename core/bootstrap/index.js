/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 2nd May 2020 4:15:25 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 1:14:04 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

// Now you can touch, but still dont touch
const path = require('path');
const bodyParser = require('body-parser');
const expressway = require('./app');
const { getFilesArray, isDotFile } = use('/support/io');
const { isEmpty, endsWith } = require('lodash');

const { app } = expressway;
const { isClass } = use('support');

const configCache = global.configCache;

/**
 * Load and cache configs
 */
const cacheConfig = () => {
    const files = getFilesArray(path.join(appRoot, '/config/'));
    if (files.length) {
        files.forEach((file) => {
            const filename = path.basename(file);
            // Dont read index files, bad omen
            if (filename === 'index.js' || isDotFile(file)) return;
            configCache[filename.replace(/\.js$/, '')] = require(file);
        });
    }
};

/**
 * Load and cache routes
 * @param {Object} app The main app object
 */
const cacheRouters = (app) => {
    const files = getFilesArray(path.join(appRoot, '/routes/'));
    if (files.length) {
        files.forEach((file) => {
            const filename = path.basename(file);

            // Dont read index and error files
            if (
                filename == 'index.js' ||
                filename == 'errors.js' ||
                isDotFile(file)
            )
                return;

            if (config('app.env') !== 'local' && filename == 'test.js') return;

            try {
                const routes = require(file);
                if (routes && !isEmpty(routes)) {
                    app.use(`/${filename.replace(/\.js$/, '')}`, routes);
                }
            } catch (error) {
                throw error;
            }
        });
    }
};

/**
 * Autoload all global middlewares
 * @param {Object} app The main app object
 */
const loadMiddlewares = (app) => {
    const location = path.join(appRoot, '/app/middlewares/global/'),
        loadMiddleware = (middleware) => {
            if (isClass(middleware)) {
                app.use(new middleware().handle());
            } else {
                app.use(middleware());
            }
        },
        globalMiddlewareList = use('/app/middlewares/global');

    if (Array.isArray(globalMiddlewareList) && globalMiddlewareList.length) {
        globalMiddlewareList.forEach((middleware) => {
            // Absolute middleware
            if (middleware.split('/').length > 1) {
                loadMiddleware(require(path.join(appRoot, middleware)));
            } else {
                loadMiddleware(require(`${location}${middleware}`));
            }
        });
        return;
    }

    const files = getFilesArray(location);

    if (files.length) {
        files.forEach((file) => {
            // Dont read index files, bad omen
            if (endsWith(file, 'index.js') || isDotFile(file)) return;
            const middleware = require(`${file}`);
            loadMiddleware(middleware);
        });
    }
};

/**
 * Boot the system
 */
expressway.bootstrap = () => {
    // Cache config
    cacheConfig();

    app.boot = async () => {
        // Load features
        await require('./loader')(app);

        app.disable('x-powered-by');

        // BodyParser Obviously
        app.use(bodyParser.json());
        app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );

        // Cookie Parser
        if (
            config('cookies.enable_cookie_parser', false) ||
            config('cookies.enable_csrf', false)
        ) {
            app.use(require('cookie-parser')(config('app.key')));
        }

        if (config('cookies.enable_csrf', false)) {
            const crsfOptions = {
                cookie: {
                    // key: config('cookies.crsf_token_name', '_crsf'),
                    path: config('cookies.cookie_path', '/'),
                    signed: true,
                    secure: config('cookies.secure_cookie', false),
                    httpOnly: config('cookies.http_only_cookie', false),
                    sameSite: config('cookies.same_site_cookie', true),
                },
                ignoreMethods: config('cookies.csrf_ignored_methods', []),
            };

            if (config('cookies.cookie_max_age', false)) {
                crsfOptions.maxAge = config('cookies.cookie_max_age');
            }

            if (config('cookies.cookie_domain', false)) {
                crsfOptions.domain = config('cookies.cookie_domain');
            }

            global.csrfProtection = require('csurf')(crsfOptions);

            app.use(csrfProtection);

            if (config('cookies.enable_global_csrf', false)) {
                app.use(csrfProtection, (req, res, next) => {
                    const token = req.csrfToken();
                    if (req.method === 'GET') {
                        res.locals[config('cookies.crsf_token_name')] = token;
                        res.cookie(config('cookies.crsf_token_name'), token, {
                            sameSite: true,
                        });
                    }

                    next();
                });
            }

            app.use((err, req, res, next) => {
                if (err.code === 'EBADCSRFTOKEN') {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: 'Forbidden',
                    });
                }
                return next();
            });
        }

        // Load external middlewares before routes
        loadMiddlewares(app);

        const routes = use('/routes');

        // Routers
        app.use('/', routes.main);

        cacheRouters(app);

        // Static files
        const staticLocation = config('app.static_dir');
        if (staticLocation)
            app.use(expressway.static(path.join(appRoot, staticLocation)));

        // Catch all error handler
        app.use(routes.errors);

        // For chainging Purpose
        return app;
    };

    app.serve = (port = null) => {
        try {
            const usedPort = port || config('app.port') || 3000;
            app.listen(usedPort, null, () =>
                console.log(`🚀 Expressway on lane ${usedPort}`)
            );
        } catch (error) {
            console.error(error);
        }
    };

    return app;
};

module.exports = expressway;
