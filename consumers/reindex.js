'use strict';

var elastic = require('../controllers/elastic'),
    mongoose = require('mongoose');
var emitter = require('../services/emitter');


module.exports = function(rabbit, qData) {
    rabbit.consume(qData.name, qData.maxUnackMessages, handleMessage);
};



function handleMessage(message, error, done) {
    message.query = {};
    var bulkArr = [];
    find(message, function(err, docs) {
        if (err) return console.log('===== REINDEX ERR ================', err);
        docs.forEach(function(doc) {
            
            doc.created = new Date();
            doc.updated = new Date();

            bulkArr.push({
                index: {
                    _index: message.index,
                    _type: message.type,
                    _id: doc._id
                }
            });

            delete doc._id;
            bulkArr.push(doc);
        });
        console.log('SEND TO BULK: ' + message.collection  + ' FROM- ' + message.offset + ' LIMIT- ' + message.limit);
        elastic.bulk(bulkArr, function(err) {
            if (err) return error(err);
            if (message.last && message.last == true) {
                console.log('message',message.offset)
              emitter.emit('finishReindex');
            }
            done();
        });
    });
    
};


function find(options, callback) {
    mongoose.connection.db.collection(options.collection, function(err, collection) {
        collection.find(options.query).skip(options.offset).limit(options.limit).toArray(callback);
    });
}
