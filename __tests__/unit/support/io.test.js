/*
 * File: io.test.js
 * Project: expressway
 * File Created: Monday, 20th July 2020 2:14:27 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 2:25:58 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
const io = require('../../../support/io'),
    path = require('path');

describe('support/io', () => {
    test('should be diretory', () => {
        return expect(io.isDirectory(__dirname)).toBe(true);
    });

    test('should be file', () => {
        return expect(io.isFile(path.join(__dirname, 'io.test.js'))).toBe(true);
    });

    test('should return array of filenames', () => {
        return expect(
            io
                .getFilesArray(__dirname)
                .includes(path.join(__dirname, 'io.test.js'))
        ).toBe(true);
    });

    test('should be dot file', () => {
        expect(io.isDotFile('../../../.gitignore')).toBe(true);
    });
});
