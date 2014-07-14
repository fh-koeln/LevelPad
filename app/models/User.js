'use strict';

// The user model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function validateUsernameLength(username) {
	if ( ! username ) {
		return false;
	}

	if (username.length <= 3 || username.length > 20) {
		return false;
	} else {
		return true;
	}
}

function validateStudentNumber(studentNumber) {
  	if ( ! /^\d+$/.test(studentNumber) ) {
    	return false;
	} else {
    	return true;
    }
}

var userNameValidations = [
	{ validator: validateUsernameLength, msg: 'Der Benutzername ist ungültig' }
];

var studentNumberValidations = [
	{ validator: validateStudentNumber, msg: 'Die Matrikelnummer ist ungültig' }
];

var userSchema = new Schema({
	username: {type: String, required: true, lowercase: true, unique: true, trim: true, validate: userNameValidations},
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	email: {type: String, required: true},
	studentNumber: {type: String, required: false, validate: studentNumberValidations},
	role: {type: String, enum: ['guest', 'student', 'lecturer', 'assistent', 'administrator'], default: 'guest'}
});

userSchema.statics.findByUsername = function (username, callback) {
	this.findOne({ username: username }, callback);
};

module.exports = mongoose.model('User', userSchema);
