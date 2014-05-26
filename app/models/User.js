"use strict";

// The user model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, default: '', lowercase: true},
	firstname: {type: String, default: ''},
	lastname: {type: String, default: ''},
	email: {type: String, default: ''},
	studentNumber: Number
});

userSchema.statics.findByUsername = function (username, callback) {
	this.findOne({ username: new RegExp(username, 'i') }, callback);
};

module.exports = mongoose.model('User', userSchema);
