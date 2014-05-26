'use strict';

// The artifact model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var artifactSchema = new Schema({
	subject: ObjectId, // Subject model
	title: {type: String, default: 'no title' },
	createdAt: {type: Date, default: Date.now},
	description: {type: String, default: '' },
});

artifactSchema.statics.findBySubjectAndId = function (subject, artifact, callback) {
	this.findOne({ subject: subject, _id: artifact }, callback);
};

module.exports = mongoose.model('Artifact', artifactSchema);
