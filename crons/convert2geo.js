'use strict';

var mongoose = require('mongoose');

mongoose.createConnection('mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/402-prod');

var NodeGeocoder = require('node-geocoder');
var producer = require('../producers');
console.log('producer', producer)


var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBUbuvz7kDT9u2G1C98UV7BHxO-BCOJUUg', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);
require('../models/record');

var Record = mongoose.model('Record');
var data = {};
module.exports = function (message, error, done) {

    Record.count({
        '$or': [{ listing_type_1: 2 }, { listing_type_1: 3 }],
        "address_city":
            { $exists: true }
    }, function (err, count) {
        const recordsCount = count;
        var limit = 100;
        console.log('count new records', count)
        if (err) {
            return console.error('================ REINDEX ERR ==========', err);
        }
        const params = {
            'collection': 'records'
        }
        for (var i = 0; i < count; i += limit) {
            const currLimit = ((count - i) >= limit) ? limit : count - i
            data = {
                offset: i,
                limit: currLimit,
                collection: params.collection,
                params: params,
                index: params.index,
                last: i + currLimit == recordsCount
            };
            console.log('CONVERT LOCATION CREATE SEARCH MONGO JOB ', params.collection, data.offset, data.limit);
            producer.createJob('convert-location', data);
        };
        (done || Function)();
    });
}
