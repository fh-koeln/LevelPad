"use strict";

// The evaluation model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var evaluationSchema = new Schema({
	createdAt: {type: Date, default: Date.now},
	comment: { type: String, default: '' },
	level: ObjectId, // Level model
	artifact: ObjectId // Artifact model
});


module.exports = mongoose.model('Evaluation', evaluationSchema);
