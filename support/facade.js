/*
 * File: facade.js
 * Project: porton-health-api
 * File Created: Thursday, 16th July 2020 7:13:41 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Thursday, 16th July 2020 7:45:56 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

/**
 * Oh beautiful facade
 * Create a proxy of a class to call its member methods like static methods
 * Just for fluency in programming
 *
 * @param {Class} Klass The class to proxy
 * @return Proxy
 */
module.exports = (Klass) => {
	return new Proxy(Klass, {
		get: (target, prop) => {
			// For object properties
			if (typeof target[prop] !== 'undefined') return target[prop];

			const instance = new target();
			// For instance properties
			if (prop in Object.keys(instance)) {
				return target[prop];
			}

			// return a new function for a method
			return function wrapper() {
				try {
					// Call it as a member method to the class
					return instance[prop].apply(instance, arguments);
				} catch (error) {
					// Call it as a static method
					// Throw error after this if it is still not working
					return target[prop].apply(null, arguments);
				}
			};
		},
	});
};
