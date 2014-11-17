'use strict';

// The level model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var levelSchema = new Schema({
	level: { type: Number, required: true },
	title: { type: String, require: true },
	description: { type: String, required: true },
	isMinimum: { type: Boolean, default: false }
});

module.exports = mongoose.model('Level', levelSchema);
