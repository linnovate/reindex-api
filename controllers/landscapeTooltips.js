'use stricts';

require('../models/tooltip');

var mongoose = require('mongoose'),
  Tooltips = mongoose.model('Tooltip');

module.exports = {
  all: function(req, res, next) {

    Tooltips.find().exec((err, tooltips) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            tooltips: tooltips
            });
        }
    );
  },
  create: function(req, res, next) {
    const record = req.body.record;
    const coords = req.body.coords;
    const tooltips = new Tooltips({
        record,
        coords
    });

    tooltips.save((err, tooltips) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            tooltips: tooltips
            });
        }
    );
  },
  get: function(req, res, next) {
    Tooltips.findOne({_id: req.params.tooltipId}).populate('record').exec((err, tooltips) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            tooltips: tooltips
            });
        }
    );
  },
  update: function(req, res,next) {
    Tooltips.findOneAndUpdate({_id: req.params.tooltipId}, { $set: { coords: '4545,889,7978,544' }}, ((err, tooltips)=> {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            tooltips: tooltips
            });
        })
    );
  }
};