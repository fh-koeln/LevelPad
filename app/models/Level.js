'use strict';

// The level model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var levelSchema = new Schema({
	description: { type: String, required: true },
	level: { type: Number, required: true },
	slug: { type: String, require: true},
	title: {type: String, require: true}
});


module.exports = mongoose.model('Level', levelSchema);
