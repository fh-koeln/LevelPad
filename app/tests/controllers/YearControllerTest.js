'use strict';

var YearController = require('../../controllers/YearController'),
	expect = require('chai').expect,
	db = require('../db'),
	async = require('async');

describe('YearController', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData
		], done);
	});

	describe('list', function() {
		it('should contain the current and at least the next year', function(done) {
			YearController.list(function(err, years) {

				expect(err).to.be.null;
				expect(years).to.have.length.above(1);
				expect(years).to.have.length.below(28); // yep, will fail in ten years 2042

				var firstYear = years[0];
				expect(firstYear).property('slug', '2014');
				expect(firstYear).property('name', '2014');
				expect(firstYear).property('year', 2014);

				var nextYear = years[1];
				expect(nextYear).property('slug', '2015');
				expect(nextYear).property('name', '2015');
				expect(nextYear).property('year', 2015);

				done(err);
			});
		});
	});

});
