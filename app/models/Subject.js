'use strict';

// The subject model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var subjectSchema = new Schema({
	slug: { type: String, require: true },
	module: { type: ObjectId, ref: 'Module', required: true },
	year: { type: Number, required: true },
	semester: { type: String, enum: [ 'Wintersemester', 'Sommersemester' ], required: true },
	status: { type: String, enum: [ 'active', 'inactive' ], required: true },
	registration_active: { type: Boolean, default: false },
	registration_expires_at: Date,
	registration_password: String,
	tasks: [ { type: ObjectId, ref: 'Task' } ],
	members: [ { type: ObjectId, ref: 'Member' } ]
});

subjectSchema.index({ slug: 1, module: 1}, { unique: true });

subjectSchema.statics.findBySlug = function (slug, callback) {
	this.findOne({ slug: slug }, callback);
};

module.exports = mongoose.model('Subject', subjectSchema);
