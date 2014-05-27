'use strict';

// The module model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var moduleSchema = new Schema({
	shortName: { type: String },
	name: { type: String }
});

module.exports = mongoose.model('Module', moduleSchema);
