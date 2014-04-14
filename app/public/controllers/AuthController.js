/* global angular, console, io */

angular.module('levelPad').controller('AuthController', function ($scope, $http, $location) {
	'use strict';

	$scope.login = function() {
		console.log('Login... ' + $scope.username);
		$http.post('/login', $.param({
			username: $scope.username,
			password: $scope.password
		}), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function() {
			$scope.message = "Login success!";
			console.log('Login result:');
			console.log(arguments);
			$location.path('/account');
		}).error(function() {
			$scope.message = "Login error!";
		});
	};

	$scope.logout = function() {
		console.log('Logout...');
		$http.post('/logout').success(function() {
			$scope.message = "Logout success!";
			console.log('Logout result:');
			console.log(arguments);
			$location.path('/');
		}).error(function() {
			$scope.message = "Logout error!";
		});
	};

});
