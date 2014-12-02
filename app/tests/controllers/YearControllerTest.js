'use strict';

var YearController = require('../../controllers/YearController'),
	assert = require('chai').assert,
	expect = require('chai').expect,
	db = require('../db'),
	async = require('async'),
	Subject = require('../../models/Subject');


describe('YearController', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData
		], done);
	});

	describe('list', function() {
		it('should contain the current and at least the next year', function(done) {
			async.waterfall([
				function(next) {
					Subject.findOne().lean().select('year').sort('year').exec(next);
				},
				function(firstYearSubject, next) {
					var firstYear = firstYearSubject.year;
					assert.isNotNull(firstYear, 'firstYear should be not null');

					YearController.list(function(err, years) {
						expect(err).to.be.null;
						expect(years).to.have.length.above(2);

						expect(years[0]).property('slug', (firstYear).toString());
						expect(years[0]).property('name', (firstYear).toString());
						expect(years[0]).property('year', firstYear);

						expect(years[1]).property('slug', (firstYear + 1).toString());
						expect(years[1]).property('name', (firstYear + 1).toString());
						expect(years[1]).property('year', firstYear + 1);

						next(err);
					});
				}
			], done);
		});
	});

});
