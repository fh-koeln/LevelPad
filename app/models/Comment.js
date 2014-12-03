'use strict';

// The evaluation model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var commentSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: ObjectId, ref: 'User', require: true },
	text: { type: String, require: true },
	task: { type: ObjectId, ref: 'Task', require: true },
});

module.exports = mongoose.model('Comment', commentSchema);
