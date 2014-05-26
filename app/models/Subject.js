'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var subjectSchema = new Schema({
	year: {type: String, },
	semester: { type: String, enum: ['Wintersemester', 'Sommersemester'] },
	module: {type: String },
});

subjectSchema.statics.findByName = function (name, callback) {
	this.findOne({ module: new RegExp(name, 'i') }, callback);
};


module.exports = mongoose.model('Subject', subjectSchema);
