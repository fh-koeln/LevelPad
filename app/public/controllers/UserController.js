angular.module('levelPad').controller('UserController', function ($scope, $http) {
	'use strict';

	$http.get('/api/users').success(function(users) {
		$scope.users = users;
	});

});
