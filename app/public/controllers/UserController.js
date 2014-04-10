'use strict';

angular.module('levelPad').controller('UserController', function ($scope, $http) {

	$http.get('/users').success(function(users) {
		$scope.users = users;
	});

});
