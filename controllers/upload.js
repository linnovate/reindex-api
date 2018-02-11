'use stricts';
require('../models/newrecord');
require('../models/record');
require('../models/record-request')

var mongoose = require('mongoose'),
  NewRecords = mongoose.model('NewRecord'),
  Records = mongoose.model('Record'),
  RecordRequest = mongoose.model('RecordRequest'),
  async = require('async'),
  _ = require('lodash'),
  csv = require('csv-parser'),
  fs = require('fs'),
  shell = require('shelljs'),
  producer = require('../producers'),
  path = require("path"),
  config = require('../config'),
  inputPath = path.resolve(config.root, 'files'),
  emitter = require('../services/emitter'),
  parse = require('co-busboy'),
  formidable = require('formidable'),
  util = require('util'),
  csvWriter = require('csv-write-stream'),
  moment = require('moment'),
  reindex = require('./reindex');

var writer = csvWriter({ headers: config.headersCSV });
var found = false;
var findrr = false;
var flagFindRR = false;



var fileName;
var dbName = config.dbName;

function checkAndDelete(objFind, cb) {
  reindex.test(true, objFind, function (bool) {
    console.log('return from reindex - 1', bool)
    if (bool) {
      reindex.test(false, objFind, function (bool) {
        console.log('return from reindex - 2', bool)
          cb(true);
      })
    }
    else cb(false);
  })
}



function writeToCsv(writer, record, flag) {
  if (record.requests.length) {
    findrr = true;
    console.log('records[i].requests.length', record.requests)
    let arrRR = record.requests;
    var now = moment(new Date());
    var before = moment().subtract(5, 'months').format('MMM YYYY');
    RecordRequest.find({
      '_id': { '$in': arrRR },
      'created': { '$gte': before, '$lt': now },
      'approved.val': true
    }).exec(function (err, rr) {
      if (err) console.log(err);
      else {
        console.log('rrrrrrrrr', rr.length)
        if (rr.length) {
          found = true;
          console.log('foundddd')
          writer.write([record.business_name, record.first_name, record.last_name, record.business_description,
          record.address_street_name, record.address_street_number, record.address_street_entrance, record.address_neighborhood,
          record.address_additional_info, record.address_city, record.phone,
          record.phone_2, record.email, record.website, record.listing_type_1, record.tags, record.categories_str])
        }
      }
      if (flag)
        flagFindRR = true;
    })
  }
}


module.exports = {
  upload: function (req, res, next) {
    var objFind;
    var type = parseInt(req.query.type);
    if (type === 1)
      objFind = {
        'listing_type_1': type,
        'address_city': req.query.city
      };
    else
      objFind = {
        'listing_type_1': type,
        '$or': [{ tags: { '$regex': ".*" + req.query.cat + ".*" } }, { categories: { '$in': [req.query.cat] } }],
        'address_city': req.query.city,
        'cat': req.query.cat
      };
    var form = new formidable.IncomingForm();
    form.uploadDir = inputPath;
    form.parse(req, function (err, fields, files) { });
    form.on('file', function (field, file) {
      fileName = file.name
      fs.rename(file.path, form.uploadDir + "/" + file.name);
    });
    form.on('end', function () {
      const headers = config.headersCSV;
      fs.createReadStream(inputPath + '/' + fileName)
        .pipe(csv())
        .on('headers', function (headerList) {
          let flag = false, count = 0, arrLength;
          arrLength = headers.length - 1;
          headers.forEach(function (header) {
            console.log(header, headerList.indexOf(header))
            if (headerList.indexOf(header) <= -1) {
              if (header === 'business_name') {
                if (!headerList.indexOf('first_name') >= 0 && headerList.indexOf('last_name') >= 0)
                  flag = true;
              }
              else if (header === 'first_name' || header === 'last_name') {
                if (!headerList.indexOf('first_name') >= 0 && headerList.indexOf('last_name') >= 0 && headerList.indexOf('business_name') <= -1)
                  flag = true;
              }
              else flag = true;
            }
          }, this);
          if (flag)
            res.status(500).send('headerline not valid');
          else {
            checkAndDelete(objFind, function (bool) {
              console.log('return to function')
              if (bool) {
                const mongoimportexecstring = "mongoimport -d " + config.dbName + " -c newrecords --type csv --file " + inputPath + '/' + fileName + " --headerline";
                shell.exec(mongoimportexecstring);
                console.log('---------------------')
                NewRecords.find({
                }).exec(function (err, newrecords) {
                  if (err) res.status(500).send(err);
                  else {
                    async.forEachOf(newrecords, function (doc, key, callback) {
                      doc.categories = doc.categories_str.split('|');
                      doc.categories = doc.categories.map((r) => r.trim());
                      if (doc.categories[doc.categories.length - 1] === '') doc.categories.splice(doc.categories.length - 1, 1);
                      var promise = doc.save();
                      promise.then(function (d) {
                        callback();
                      });
                    }, function (err) {
                      if (err) return res.send(err);
                      const params = {
                        'index': config.records.index,
                        'type': config.records.type,
                        'collection': 'newrecords'
                      }
                      var limit = 1000;
                      NewRecords.count({}, function (err, count) {
                        const recordsCount = count;
                        console.log('count new records', count)
                        if (err) {
                          return console.error('================ REINDEX ERR ==========', err);
                        }
                        for (var i = 0; i < count; i += limit) {
                          const currLimit = ((count - i) >= limit) ? limit : count - i
                          data = {
                            offset: i,
                            limit: currLimit,
                            collection: params.collection,
                            params: params,
                            index: params.index,
                            type: params.type,
                            last: i + currLimit == recordsCount
                          };
                          console.log('REINDEX CREATE SEARCH MONGO JOB ', params.collection, data.offset, data.limit);
                          producer.createJob('reindex-data', data);
                        };
                        emitter.on('finishReindex', function () {
                          console.log('in emit')
                          shell.exec('mongodump -d ' + dbName + ' -c newrecords --out /tmp')
                          shell.exec('mongorestore -d ' + dbName + ' -c records /tmp/' + dbName + '/newrecords.bson')
                          NewRecords.deleteMany({}, function (err, results) {
                            console.log('delete', results.result);
                            // fs.unlink(inputPath +'/'+fileName, (err) => {
                            //   if (err) throw err;
                            //   console.log('successfully deleted /files/'+'/'+fileName);
                            // });
                          });
                        });
                      });
                    });
                  }
                })

                res.send('records updated')
              }
              else res.send('cant update')

            });

          }
        });

    });

  },
  download: function (req, res, next) {
    let type,cat, city, categories;
    type = parseInt(req.body.type)
    cat = req.body.cat;
    city = req.body.city;
    categories = [cat];
     if (type === 1)
      objFind = {
        'listing_type_1': type,
        'address_city': city
      };
    else
      objFind = {
        'listing_type_1': type,
        '$or': [{ tags: { '$regex': ".*" + cat + ".*" } }, { categories: { '$in': [cat] } }],
        'address_city': city,
      };
    Records.find(objFind).exec(function (err, records) {
      if (err) console.log(err);
      console.log('here',records.length)
      writer.pipe(fs.createWriteStream(inputPath + '/updateds.csv'))
      for (var i = 0; i < records.length; i++) {
        writeToCsv(writer, records[i], i == records.length - 1)
      }
      if (!findrr)
        res.send({ 'succsess': false })
      else if (flagFindRR === true) {
        if (!found) res.send({ 'succsess': false })
        else res.send({ 'succsess': true })
      }
      else res.status(200).send({ 'succsess': true })
    });
  }

}


