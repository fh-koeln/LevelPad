'use strict';

// The user model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	acl = require('../../config/acl');

function validateUsernameLength(username) {
	if (!username) {
		return false;
	}

	if (username.length < 2 || username.length > 20) {
		return false;
	} else {
		return true;
	}
}

function validateNamesLength(name) {
	if (!name) {
		return false;
	}

	if (name.length < 2) {
		return false;
	} else {
		return true;
	}
}

function validateStudentNumber(studentNumber) {
	if (!studentNumber) {
		return false;
	}

  	if ( /^[0-9]{8}$/.test(studentNumber) ) {
    	return true;
	} else {
    	return false;
    }
}

function validateEmail(email) {
	if (!email) {
		return false;
	}

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
	firstname: { type: String, required: true, trim: true, validate: firstnameValidations },
	lastname: { type: String, required: true, trim: true, validate: lastnameValidations },
	email: { type: String, required: true, unique: true, trim: true, validate: emailValidations },
	studentNumber: { type: String, required: false, unique: true, sparse: true, trim: true, validate: studentNumberValidations },
	role: { type: String, required: true, enum: [ 'guest', 'student', 'lecturer', 'assistent', 'administrator' ] }
});

userSchema.statics.findByUsername = function (username, callback) {
	this.findOne({ username: username }, callback);
};

userSchema.post('save', function(user) {
	acl.setRole(user.username, user.role, function(err) {
//		console.log(err);
	});
});

userSchema.post('remove', function(user) {
	acl.removeRole(user.username, function(err) {
//		console.log(err);
	});
});

module.exports = mongoose.model('User', userSchema);
