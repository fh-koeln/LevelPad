'use strict';

// The evaluation model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var evaluationSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: ObjectId, ref: 'User', require: true },
	comment: { type: String, default: '' },
	task: { type: ObjectId, ref: 'Task', require: true },
	level: { type: ObjectId, ref: 'Level', require: true }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
