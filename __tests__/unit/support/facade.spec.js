/*
 * File: facade.spec.js
 * Project: expressway
 * File Created: Monday, 20th July 2020 1:28:27 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 2:15:06 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const facade = require('../../../support/facade');

describe('Facade:', () => {
    test('should should convert static call to member methods', () => {
        class FadaceTest {
            say(hi) {
                return hi;
            }
        }

        const Facade = facade(FadaceTest);
        const text = 'Whatever';
        return expect(Facade.say(text)).toBe(text);
    });
});
