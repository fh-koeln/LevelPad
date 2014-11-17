'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	Task = require('./Task');

var subjectSchema = new Schema({
	slug: { type: String, require: true },
	module: { type: ObjectId, ref: 'Module', required: true },
	year: { type: Number, required: true },
	semester: { type: String, enum: [ 'Wintersemester', 'Sommersemester' ], required: true },
	status: { type: String, enum: [ 'active', 'inactive' ], required: true },
	registrationActive: { type: Boolean, default: false },
	registrationExpiresAt: { type: Date },
	registrationPassword: { type: String, default: '' },
	tasks: [ Task.schema ], // Embedded document
	members: [ { type: ObjectId, ref: 'Member' } ]
});

subjectSchema.index({ slug: 1, module: 1}, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
