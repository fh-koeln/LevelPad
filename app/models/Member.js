'use strict';

// The member model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var memberSchema = new Schema({
	user: { type: ObjectId, ref: 'User', required: true }, // User model
	role: { type: String, required: true, enum: [ 'member', 'assistant', 'creator' ] }
});

module.exports = mongoose.model('Member', memberSchema);
