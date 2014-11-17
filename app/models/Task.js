'use strict';

// The task model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Level = require('./Level');

var taskSchema = new Schema({
	levels: [Level],
	description: { type: String },
	slug: { type: Number, require: true},
	title: { type: String, required: true },
	threshold: {type: Number, require: true},
	weight: {type: Number, required:true}
});

module.exports = mongoose.model('Task', taskSchema);
