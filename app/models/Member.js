'use strict';

// The member model

// TODO: Could we implement this as embedded resource instead of an n-m relation?

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var memberSchema = new Schema({
	user: {type: ObjectId, ref: 'User', required: true}, // User model
	subject: {type: ObjectId, ref: 'Subject', required: true} // Subject model
});


module.exports = mongoose.model('Member', memberSchema);
