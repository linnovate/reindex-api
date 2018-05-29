'use stricts';

require('../models/settings');

var mongoose = require('mongoose'),
  Settings = mongoose.model('Settings');

module.exports = {
  all: function(req, res, next) {

    Settings.find().exec((err, settings) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            settings: settings
            });
        }
    );
  },
  create: function(req, res, next) {
    const key = req.body.key;
    const value = req.body.value;

    const setting = new Settings({
        key,
        value
    });

    setting.save((err, setting) => {
        console.log(err, setting)
        if (err) {
            return next(err);
        }
        res.status(200).json({
            setting: setting
            });
        }
    );
  },
  get: function(req, res, next) {
    Settings.findOne({_id: req.params.key}).exec((err, setting) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            setting: setting
            });
        }
    );
  },
  update: function(req, res,next) {
    Settings.findOneAndUpdate({_id: req.params.key}, { $set: { value: req.body.value }}, ((err, setting)=> {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            setting: setting
            });
        })
    );
  }
};