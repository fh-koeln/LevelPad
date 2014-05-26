'use strict';

// The level model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var levelSchema = new Schema({
	description: { type: String, default: '' },
	level: {type: Number, enum: [1, 2, 3, 4, 5] }
});


module.exports = mongoose.model('Level', levelSchema);
