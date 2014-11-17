'use strict';

// The level model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var levelSchema = new Schema({
	level: { type: Number, required: true },
	title: { type: String, require: true },
	description: { type: String, required: true },
	slug: { type: String, require: true },
	isMinimum: { type: Boolean, require: true }
});

module.exports = mongoose.model('Level', levelSchema);
