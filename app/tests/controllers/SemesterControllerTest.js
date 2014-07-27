'use strict';

var SemesterController = require('../../controllers/SemesterController'),
	assert = require('chai').assert,
	expect = require('chai').expect,
	sinon = require('sinon');

describe('SemesterController', function() {

	var req, res;

	beforeEach(function() {
		req = {};
		res = {};
		res.json = sinon.spy();
	});

	describe('getAll', function() {
		it('should contain 2014', function() {
			SemesterController.getAll(req, res);

			assert(res.json.calledWith(200));
		});
	});

});
