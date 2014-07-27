'use strict';

var SemesterController = require('../../controllers/SemesterController'),
	assert = require('chai').assert,
	expect = require('chai').expect;

describe('SemesterController', function() {
	describe('getAll', function() {
		it('should contain 2014', function(done) {
			SemesterController.getAll(function(err, semesters) {

				expect(err).to.be.null;
				expect(semesters).to.have.length(2);

				done(err);
			});
		});
	});

});
