'use strict';

angular.module('levelPad').controller('UserController', function ($scope, $http) {

	$http.get('/api/users').success(function(users) {
		$scope.users = users;
	});

});
