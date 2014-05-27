'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;

var subjectSchema = new Schema({
	year: { type: String },
	semester: { type: String, enum: ['Wintersemester', 'Sommersemester'] },
	module: ObjectId
});


module.exports = mongoose.model('Subject', subjectSchema);
