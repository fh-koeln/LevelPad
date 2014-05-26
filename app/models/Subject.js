'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var subjectSchema = new Schema({
	year: {type: String, },
	semester: { type: String, enum: ['Wintersemester', 'Sommersemester'] },
	module: {type: String },
	moduleShort: {type: String },
});


module.exports = mongoose.model('Subject', subjectSchema);
