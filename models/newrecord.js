/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('lodash'),
  Elastic = require('../controllers/elastic'),
  config = require('../config');

var NewRecordSchema = new Schema({
  raw: Map,
  calculated: Map,
  wp_num: Number,
  business_name: String,
  first_name: String,
  last_name: String,
  business_description: String,
  business_website: String,
  address_street_name: String,
  address_street_number: String,
  address_street_entrance: String,
  address_additional_info: String,
  address_neighborhood: String,
  address_city: String,
  location: Array,
  latitude: String,
  longitude: String,
  phone: String,
  phone_2: String,
  phone_3: String,
  phone_landline: String,
  email: String,
  website: String,
  Timestamp_1: String,
  listing_type_2: Number,
  listing_type_1: Number,
  multipurpose1: String,
  empty_1: String,
  Empty_2: String,
  tags: String,
  categories: [String],
  categories_str: String,
  logo: String,
  founder:String,
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  is_deleted: Boolean,
  is_deleted_checked: Boolean,
  score_value: Number//,
//   score: {
//     options: [String],
//     value: Number
//   }
}, {
  collection: 'newrecords'
});

// NewRecordSchema.pre('save', function (next) {
//   var data = this,
//     err;

//   if ((data[Constants.RECORD_MODEL_TYPE_FIELD] === Constants.PEOPLE_TYPE) && (!data.first_name || !data.last_name))
//     return next(new Error('first_name or last_name are missing'));
//   else if ((data[Constants.RECORD_MODEL_TYPE_FIELD] === Constants.BUSINESSES_TYPE) && (!data.business_name))
//     return next(new Error('business_name is missing'));

//   this.updated = new Date();
//   next();
// });

// NewRecordSchema.post('save', function (doc) {
//   var _doc = JSON.parse(JSON.stringify(doc));
//   delete _doc._id;
//   Elastic.index(config.records.index, config.records.type, doc._id.toString(), _doc).then(function (data) {}, function (error) {});
// });

mongoose.model('NewRecord', NewRecordSchema);
