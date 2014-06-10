'use strict';

// The artifact model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	levelSchema = require('./Level');



var taskSchema = new Schema({
	levels: [levelSchema],
	description: { type: String },
	slug: { type: Number, require: true},
	title: { type: String, required: true },
	threshold: {type: ObjectId, require: true},
	weight: {type: Number, ref: 'Level', required:true}					
	
});

module.exports = mongoose.model('Task', taskSchema);
