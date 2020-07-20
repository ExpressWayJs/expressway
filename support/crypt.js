/*
 * File: crypt.js
 * Project: expressway
 * File Created: Wednesday, 29th April 2020 10:52:04 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 3:49:48 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const { config } = require('./globals');
let passphrase,
    defaultKey =
        'A0No1t3Very5Secure8Pass5ThaT09!IasAm09Using99Is=This-Long8Enuf>?';
try {
    passphrase = config('crypto.key');
} catch (error) {
    passphrase = defaultKey;
}

if (!passphrase) passphrase = defaultKey;

exports.decrypt = (val) => {
    if (val) {
        return CryptoJS.AES.decrypt(val, passphrase).toString(
            CryptoJS.enc.Utf8
        );
    }
};

exports.encrypt = (value) => {
    return value
        ? CryptoJS.AES.encrypt(value.toString(), passphrase).toString()
        : '';
};

exports.sha512 = (string) => {
    return string
        ? crypto
              .createHash('sha512')
              .update(string.toString(), 'utf8')
              .digest('hex')
        : '';
};
