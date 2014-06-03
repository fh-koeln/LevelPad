'use strict';

// The artifact model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var levelSchema = new Schema({
	slug: { type: String, require: true, unique: true },
	description: { type: String, required: true },
	level: { type: Number, enum: [1, 2, 3, 4, 5] }
});


var taskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	levels: [levelSchema]
});

module.exports = mongoose.model('Task', taskSchema);
