'use strict';

var YearController = require('../../controllers/YearController'),
	expect = require('chai').expect;

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
