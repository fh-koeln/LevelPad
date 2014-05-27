'use strict';

// The module model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var moduleSchema = new Schema({
	shortName: { type: String, required: true },
	name: { type: String, required: true }
});

module.exports = mongoose.model('Module', moduleSchema);
