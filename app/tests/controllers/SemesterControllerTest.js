'use strict';

var SemesterController = require('../../controllers/SemesterController'),
	assert = require('chai').assert,
	expect = require('chai').expect;

describe('SemesterController', function() {
	describe('list', function() {
		it('should contain both standard semesters', function(done) {
			SemesterController.list(function(err, semesters) {

				expect(err).to.be.null;
				expect(semesters).to.have.length(2);

				var semester1 = semesters[0];
				expect(semester1).property('slug', 'sose');
				expect(semester1).property('name', 'Sommersemester');

				var semester2 = semesters[1];
				expect(semester2).property('slug', 'wise');
				expect(semester2).property('name', 'Wintersemester');

				done(err);
			});
		});
	});

});
