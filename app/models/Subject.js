'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var subjectSchema = new Schema({
	module: {type: ObjectId, ref: 'Module', required: true},
	tasks: [{type: ObjectId, ref: 'Artifact'}],
	registration_active: {type: Boolean, default: false},
	registration_expires_at: Date,
	registration_password: String,
	semester: { type: String, enum: ['Wintersemester', 'Sommersemester'], required: true },
	slug: {type: String, require: true, unique: true},
	year: { type: Number, required: true }
});

subjectSchema.statics.findBySlug = function (slug, callback) {
	this.findOne({ slug: slug }, callback);
};


module.exports = mongoose.model('Subject', subjectSchema);
