'use strict'

const mongoose = require('mongoose');
const { db : {host, name, port}} = require('../configs/config.db');

const connectString = `mongodb://${host}:${port}/${name}`;


class Database {
    constructor() {
        this.connect();
    }

    connect() {
        if (1 == 1) {
            mongoose.set(`debug`, true);
            mongoose.set(`debug`, { color: true });
        }
        console.log(` ${connectString}`)
        mongoose.connect(connectString, {maxPoolSize : 50})
            .then(_ => console.log(`connect to mongodb success`))
            .catch(err => console.log(`connect to db error`))

    }

    static getInstsance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstsance();

module.exports = instanceMongoDb;