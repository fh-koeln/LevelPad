'use strict';

var YearController = require('../../controllers/YearController'),
	assert = require('chai').assert,
	expect = require('chai').expect,
	sinon = require('sinon');

describe('YearController', function() {

	describe('getAll', function() {

		it('should contain 2014', function(done) {
			YearController.getAll(function(err, years) {

				expect(err).to.be.null;
				expect(years).to.have.length(3);

				done(err);
			});
		});
	});

});
