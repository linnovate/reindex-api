/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var Tooltip = new Schema({  
  record: {
    type: Schema.Types.ObjectId,
    ref: 'Record'
  },
  coords: {
    type: Array
  },
  shape: {
    type: String,
    default: "rect"
  }
}, {
collection: 'Tooltip'
});


mongoose.model('Tooltip', TooltipSchema);