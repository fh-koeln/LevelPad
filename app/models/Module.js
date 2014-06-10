'use strict';

// The module model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var moduleSchema = new Schema({
	slug: { type: String, require: true, unique: true },
	shortName: { type: String, required: true },
	name: { type: String, required: true }
});

moduleSchema.statics.findBySlug = function (slug, callback) {
	this.findOne({ slug: slug }, callback);
	
};

module.exports = mongoose.model('Module', moduleSchema);
