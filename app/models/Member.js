'use strict';

// The member model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var memberSchema = new Schema({
	user: ObjectId, // User model
	subject: ObjectId // Subject model
});


module.exports = mongoose.model('Member', memberSchema);
