'use strict';

// The artifact model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var levelSchema = new Schema({
	description: { type: String, required: true },
	level: {type: Number, enum: [1, 2, 3, 4, 5] }
});


var artifactSchema = new Schema({
	title: {type: String, default: 'no title', required: true },
	description: {type: String, default: '' },
	levels: [levelSchema]
	
});

module.exports = mongoose.model('Artifact', artifactSchema);
