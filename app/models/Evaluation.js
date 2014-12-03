'use strict';

// The evaluation model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var evaluationSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: ObjectId, ref: 'User', require: true },
	task: { type: ObjectId, ref: 'Task', require: true },
	level: { type: ObjectId, ref: 'Level', require: true }
});

evaluationSchema.index({ task: 1, level: 1}, { unique: true, sparse: true }); // sparse: Both fields are optional and can be null

module.exports = mongoose.model('Evaluation', evaluationSchema);
