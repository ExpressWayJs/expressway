/*
 * File: index.test.js
 * Project: expressway
 * File Created: Monday, 20th July 2020 2:26:52 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 4:21:05 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
// require('../../../core/bootstrap/globals');

const support = require('../../../support');
const { sha512 } = require('../../../support/crypt');

describe('support', () => {
    test('should not be class', () => {
        function someFunction() {
            return 'foo';
        }

        return expect(support.isClass(someFunction())).toBe(false);
    });

    test('should be class', () => {
        class Foo {}

        expect(support.isClass(Foo)).toBe(true);
    });

    test('crypt', () => {
        const { encrypt, decrypt, sha512 } = support.crypt,
            encModel = {
                firstname_enc: 'U2FsdGVkX1+W/vam0pG6mztzXkDq3w+vkugQS4tenko=',
            },
            decModel = support.decryptModel(encModel);

        expect('foo').toBe(decrypt(encrypt('foo')));
        expect(decModel.firstname).toBe('Patient');

        const algebra = sha512('algebra'),
            numberTest = sha512(1234567890);

        expect(algebra.substr(0, 15)).toBe('df1c7ca89cb29b2');

        // Test numbers too
        expect(numberTest.substr(0, 15)).toBe('12b03226a6d8be9');
    });

    test('should return URL instance', () => {
        const gameApi = 'game_api_endpoint',
            endpoint = support.getExternalEndpoint(gameApi);
        expect(endpoint instanceof URL).toBe(true);
        expect(endpoint.endpoint).toBeDefined();
        expect(endpoint.endpoint).toBeTruthy();
    });
});
