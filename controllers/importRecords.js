'use stricts';
require('../models/newrecord');
require('../models/record');
require('../models/record-request')
//var mi = require('mongoimport');
/*var config = {
  fields: [],                     // {array} data to import
  db: 'reindex-dev',                     // {string} name of db
  collection: 'newrecords'  ,
  host: '172.17.0.1:27017',        // {string} [optional] by default is 27017
  username: 'sofish',             // {string} [optional]
  password: '***'                 // {string} [optional]
  callback: (err, db) => {}       // {function} [optional]
  };*/

var mongoose = require('mongoose'),
  NewRecords = mongoose.model('NewRecord'),
  async = require('async'),
  csv = require('csv-parser'),
  fs = require('fs'),
  shell = require('shelljs'),
  producer = require('../producers'),
  path = require("path"),
  config = require('../config'),
  inputPath = path.resolve(config.root, 'files'),
  emitter = require('../services/emitter'),
  parse = require('co-busboy'),
  formidable = require('formidable');

var NodeGeocoder = require('node-geocoder');

var options = config.gepCoderOptions;

var geocoder = NodeGeocoder(options);


var fileName;
var dbName = config.dbName;


function Upload() {

}

Upload.prototype.convert = function(address) {
  return new Promise(function (resolve, reject) {
    // return resolve(null);
    if (!address) return resolve(null);
    geocoder.geocode({ address }, function (err, data) {
        if (err){
          console.log(address);
          return reject(err);
        }
        if (data) {
            var geo = data[0];
            if (geo) {
                var location = [geo.longitude, geo.latitude];
                return resolve(location);
            }
            else reject('no data');
        } else reject('no data');
    });
  });
}
Upload.prototype.start = function(req,res,next) {
  console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
  next();
}  

Upload.prototype.upload = function(req,res,next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = inputPath;
  form.parse(req, function (err, fields, files) { });
  form.on('file', function (field, file) {
    fileName = file.name
    fs.rename(file.path, form.uploadDir + "/" + file.name);
  });
  form.on('end', function () {
    //const headers = config.headersCSV;
    fs.createReadStream(inputPath + '/' + fileName)
      .pipe(csv())
      .on('headers', function (headerList) {
        let flag = false, count = 0, arrLength;
        const mongoimportexecstring = "mongoimport -d " + dbName + " -c newrecords --type csv --file " + inputPath + '/' + fileName + " --headerline  --host 172.17.0.1";
        console.log('mongoimportexecstring',mongoimportexecstring)
        shell.exec(mongoimportexecstring, function(err, result){
          next();
        });
      });
  });
}

Upload.prototype.arrange = function(req,res,next) {
  let self = this;
  NewRecords.find({
  }).exec(function (err, newrecords) {
    if (err) res.status(500).send(err);
    else {
      async.forEachOf(newrecords, function (doc, key, callback) {
        if (doc.categories_str) {
          doc.categories = doc.categories_str.split('|');
          doc.categories = doc.categories.map((r) => r.trim());
        }
        if (doc.categories[doc.categories.length - 1] === '') doc.categories.splice(doc.categories.length - 1, 1);
        if (doc.address_city) {
          console.log('in if')
          var address = doc.address_city;
          if (doc.address_street_name)
              address += ' , ' + doc.address_street_name;
          if (doc.address_street_number)
              address += ' , ' + doc.address_street_number;
          self.convert(address).then(function (res) {
            console.log('rrrrrrrrrrrrrr',res)
            doc.calculated = {location: res};
            var promise = doc.save();
            promise.then(function (d) {
              console.log('saveeeeee')
              callback();
            });
          }).catch(function (error) {
            console.log('eeeeeeeee',error)
            console.log('error', error)
          });
        } else {
          var promise = doc.save();
          promise.then(function (d) {
            console.log('saveeeeee')
            callback();
          });
        }    
      }, function (err) {
        if (err) return res.send(err);
        next();
      });
    }
  })
}

Upload.prototype.saveRecords = function(req,res,next) {
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
    next();
  });
}

Upload.prototype.end = function(req, res, next) {
  emitter.once('finishReindex', function () {
    console.log('in emit')
    shell.exec('mongodump -d ' + dbName + ' -c newrecords --out /tmp --host 172.17.0.1')
    shell.exec('mongorestore -d ' + dbName + ' -c records /tmp/' + dbName + '/newrecords.bson --host 172.17.0.1')
    NewRecords.deleteMany({}, function (err, results) {
      console.log('delete', results.result);
      if (res) return res.send('records updated');
      next();
      // fs.unlink(inputPath +'/'+fileName, (err) => {
      //   if (err) throw err;
      //   console.log('successfully deleted /files/'+'/'+fileName);
      // });
    });
  });
}


module.exports = Upload;