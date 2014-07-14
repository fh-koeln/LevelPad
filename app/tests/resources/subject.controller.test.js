'use strict';

var should = require('should');
var async = require('async');
var server = require('../server');
var db = require('../../../config/db.js')
var User = require('../../models/User.js');

describe('Subject controller', function() {

	beforeEach(function(done) {

		async.series([
			function(callback) {
				User.count(function(err, count) {
					console.log(err + ' - ' + count);
					callback();
				});
			},
			function(callback) {
				new User({
					username: 'Username',
					firstname: 'Vorname',
					lastname: 'Nachname',
					email: 'asd@asd.de'
				}).save(function(err, user) {
					console.log('Saved: ' + err + ' - ' + user);
					callback();
				});
			},
			function(callback) {
				User.count(function(err, count) {
					console.log('Count: ' + err + ' - ' + count);
					callback();
				});
			},
			function(callback) {
				User.remove(function(err, users) {
					console.log('Removed: ' + err + ' - ' + users);
					callback();
				});
			},
			function(callback) {
				User.count(function(err, count) {
					console.log('Count: ' + err + ' - ' + count);
					callback();
				});
			}
		], done);
	});

	it('should return all resources', function(done) {
		User.find(function(err, users) {
			console.log(err);
			console.log(users);
			done();
		});
	});

	it('should return all resources', function(done) {

		var user = {
		    name: 'tj'
		  , pets: ['tobi', 'loki', 'jane', 'bandit']
		};

		user.should.have.property('name', 'tj');
		user.should.have.property('pets').with.lengthOf(4);

		server
			.get('/api/subjects')
			.expect(200)
			.end(done);

	});

});
