/*
 * File: cookies.js
 * Project: config
 * File Created: Wednesday, 13th May 2020 12:03:28 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Tuesday, 16th February 2021 12:46:38 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */

module.exports = {
    // enable cookie parser
    enable_cookie_parser: false,

    // Enable Cross Site Request Forgery
    // This automatically enables cookie parser
    enable_csrf: true,

    // Enable CRSF site wide
    enable_global_csrf: true,

    // the name of the cookie to use to store the token secret
    crsf_token_name: 'csrf_token',

    // HTTP only cookie
    // flags the cookie to be accessible only by the web server
    http_only_cookie: true,

    // sets the same site policy for the cookie.
    // This can be set to 'strict', 'lax', 'none', or true
    same_site_cookie: true,

    // Cookie domain
    // sets the domain the cookie is valid on
    // null for current domain
    cookie_domain: null,

    // The number of seconds after which the cookie will expire
    // null for session length
    cookie_max_age: null,

    // Cookie path
    cookie_path: '/',

    // marks the cookie to be used with HTTPS only
    secure_cookie: false,

    // Ignore some HTTP verbs when checking cookies
    // Array of ['GET', 'POST', 'PUT', 'HEAD', 'OPTIONS', 'DELETE']
    csrf_ignored_methods: ['GET', 'HEAD', 'OPTIONS'],
};
