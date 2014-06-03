'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var subjectSchema = new Schema({
	year: { type: Number, required: true },
	semester: { type: String, enum: ['Wintersemester', 'Sommersemester'], required: true },
	module: {type: ObjectId, ref: 'Module', required: true},
	tasks: [{type: ObjectId, ref: 'Artifact'}],
	registration_active: {type: Boolean, default: false},
	registration_expires_at: Date,
	registration_password: String
});

module.exports = mongoose.model('Subject', subjectSchema);
