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

function validateNamesLength(name) {
	if (name.length < 2) {
		return false;
	} else {
		return true;
	}
}

function validateStudentNumber(studentNumber) {
  	if ( /^[0-9]{8}$/.test(studentNumber) ) {
    	return true;
	} else {
    	return false;
    }
}

function validateEmail(email) {
  	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( re.test(email) ) {
    	return true;
	} else {
    	return false;
    }
}

var userNameValidations = [
	{ validator: validateUsernameLength, msg: 'Der Benutzername ist ungültig.' }
];

var firstnameValidations = [
	{ validator: validateNamesLength, msg: 'Der Vorname ist ungültig.' }
];

var lastnameValidations = [
	{ validator: validateNamesLength, msg: 'Der Nachname ist ungültig.' }
];

var studentNumberValidations = [
	{ validator: validateStudentNumber, msg: 'Die Matrikelnummer ist ungültig.' }
];

var emailValidations = [
	{ validator: validateEmail, msg: 'Die E-Mail-Adresse ist ungültig.' }
];

var userSchema = new Schema({
	username: { type: String, required: true, lowercase: true, unique: true, trim: true, validate: userNameValidations },
	firstname: { type: String, required: true, validate: firstnameValidations },
	lastname: { type: String, required: true, validate: lastnameValidations },
	email: { type: String, required: true, validate: emailValidations },
	studentNumber: { type: String, required: false, validate: studentNumberValidations },
	role: { type: String, required: true, enum: [ 'guest', 'student', 'lecturer', 'assistent', 'administrator' ] }
});

userSchema.statics.findByUsername = function (username, callback) {
	this.findOne({ username: username }, callback);
};

module.exports = mongoose.model('User', userSchema);
