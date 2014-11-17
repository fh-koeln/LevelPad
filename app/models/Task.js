'use strict';

// The task model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Level = require('./Level');

var taskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	slug: { type: String, require: true },
	levels: [ Level.schema ], // Embedded document
	weight: { type: Number, required: true, min: 0, max: 100 }
});

module.exports = mongoose.model('Task', taskSchema);
