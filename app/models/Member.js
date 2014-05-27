'use strict';

// The member model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var memberSchema = new Schema({
	user: {type: ObjectId, ref: 'User', required: true}, // User model
	subject: {type: ObjectId, ref: 'Subject', required: true} // Subject model
});


module.exports = mongoose.model('Member', memberSchema);
