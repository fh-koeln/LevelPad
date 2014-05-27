'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var subjectSchema = new Schema({
	year: { type: Number, required: true },
	semester: { type: String, enum: ['Wintersemester', 'Sommersemester'], required: true },
	module: {type: ObjectId, ref: 'Module', required: true},
	artifact: {type: ObjectId, ref: 'Artifact', required: true}						   
});

module.exports = mongoose.model('Subject', subjectSchema);
