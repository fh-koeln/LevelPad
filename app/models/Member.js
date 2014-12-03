'use strict';

// The member model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	Evaluation = require('./Evaluation'),
	Comment = require('./Comment');

var memberSchema = new Schema({
	user: { type: ObjectId, ref: 'User', required: true }, // User model
	subject: { type: ObjectId, ref: 'Subject', required: true }, // Subject model
	role: { type: String, required: true, enum: [ 'member', 'assistant', 'creator' ] },
	evaluations: [ Evaluation.schema ], // Embedded document
	comments: [Comment.schema] // Embedded document
});

memberSchema.index({ user: 1, subject: 1}, { unique: true });

module.exports = mongoose.model('Member', memberSchema);
