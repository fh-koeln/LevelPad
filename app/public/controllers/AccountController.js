/* global angular, console, io */

angular.module('levelPad').controller('AccountController', function ($scope, $http) {
	'use strict';

	console.log('Get account data...');
	$http.get('/account').success(function(user) {
		console.log('Get account data...');
		$scope.user = user;
	}).error(function(data, status, headers, config) {
		console.log(data);
		console.log(status);
		console.log(headers);
		console.log(config);
	});

});
