/*
 * File: index.js
 * Project: expressway
 * File Created: Saturday, 2nd May 2020 10:45:40 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 11:25:08 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */

const mongoose = require('mongoose');

class Model {
    get schema() {
        return {};
    }

    get stringId() {
        return true;
    }

    get encrypt() {
        return [];
    }

    model;
    document;

    constructor(obj = null) {
        if (!global.mongooseModels[this.constructor.name]) {
            const schemaOptions = this.schemaOptions || {},
                theSchema = new mongoose.Schema(
                    { createdAt: Date, ...this.schema },
                    schemaOptions
                );
            const that = this;
            theSchema.pre(
                'save',
                ((next) => {
                    that.beforeSave.call(this);
                    next();
                }).bind(theSchema)
            );
            this.model = mongoose.model(this.constructor.name, theSchema);
            global.mongooseModels[this.constructor.name] = this.model;
        } else {
            this.model = mongoose.models[this.constructor.name];
        }

        // Internal instance to use from now on;
        this.document = !obj ? null : new this.model(obj);
    }

    beforeSave() {
        if (this.stringId && this.document && !this.document._id) {
            this.document._id = mongoose.Types.ObjectId().toString();
            if (!this.document.createdAt) this.document.createdAt = new Date();
        }
    }

    new(obj) {
        return (this.document = new this.model(obj));
    }

    set(obj, value = null) {
        if (!this.document) return;

        // Key value pair
        if (typeof obj == 'string' && value) {
            this.document.set(obj, value);
        } else {
            if (!obj instanceof Object)
                throw new Error('Update data must be an object');
            for (let ob in obj) {
                if (obj.hasOwnProperty(ob)) {
                    this.document.set(ob, obj[ob]);
                }
            }
        }

        return this;
    }

    remove(key) {
        this.document.set(key, undefined);
        delete this.document[key];
    }

    get(key) {
        if (this.document.hasOwnProperty(key)) return this.document[key];

        return null;
    }

    init() {
        return this.model.init.apply(this.model, arguments);
    }

    find() {
        return this.model.find.apply(this.model, arguments);
    }

    findOne() {
        return this.model.findOne.apply(this.model, arguments);
    }

    encryptModel() {
        const { encrypt } = use('support/crypt');
        if (!this.encrypt.length) return this;
        let encryptCount = 0;

        const doEncrypt = (arr) => {
            for (const toCrypt of arr) {
                if (this.document.hasOwnProperty(toCrypt)) {
                    try {
                        this.set(`${toCrypt}_enc`, encrypt(this.get(toCrypt)));
                    } catch (error) {
                        console.log(toCrypt, this.get(toCrypt));
                        throw error;
                    }
                    this.remove(toCrypt);
                    encryptCount++;
                }
            }
        };

        doEncrypt(this.encrypt);

        if (encryptCount) this.document.set('_encrypted', true);

        return this;
    }

    async save() {
        if (!this.document) return;

        this.beforeSave();
        this.encryptModel();
        try {
            await this.document.save();
            return this.document;
        } catch (error) {
            throw error;
        }
    }

    async delete() {
        if (!this.document) return;
        await this.document.delete();
        return true;
    }

    toObject() {
        if (!this.document) return;
        return this.document.toObject();
    }

    exists() {
        return !!this.document;
    }

    static async find() {
        const obj = new this();
        obj.document = await obj.model.findOne.apply(obj.model, arguments);

        return obj;
    }

    static findOne() {
        return this.find.apply(this, arguments);
    }

    static async init() {
        const obj = new this();
        obj.document = await obj.model.init.apply(obj.model, arguments);

        return obj;
    }

    /**
     * Return a proxy to mongoose find
     * No need to be async as it returns a promise
     */
    static get() {
        const obj = new this();
        return obj.model.find.apply(obj.model, arguments);
    }
}

module.exports = Model;
