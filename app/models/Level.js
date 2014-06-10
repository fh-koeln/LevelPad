'use strict';

// The level model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var levelSchema = new Schema({
	slug: { type: String, require: true, unique: true },
	description: { type: String, required: true },
	level: { type: Number, required: true }
});


module.exports = mongoose.model('Level', levelSchema);
