"use strict";

// The user model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function validateUsernameLength(username) {
	if ( ! username ) {
		return false;
	}

	if (username.length <= 3 || username.length > 20 ) {
		return false;
	} else {
		return true;
	}
}

var userNameValidations = [
	{ validator: validateUsernameLength, msg: 'Username length is not valid' },
];

var userSchema = new Schema({
	username: {type: String, required: true, lowercase: true, unique: true, trim: true, validate: userNameValidations},
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	email: {type: String, required: true},
	studentNumber: {type: Number, required: true},
});

userSchema.statics.findByUsername = function (username, callback) {
	this.findOne({ username: new RegExp(username, 'i') }, callback);
};

module.exports = mongoose.model('User', userSchema);
