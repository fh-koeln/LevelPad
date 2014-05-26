'use strict';
/* global angular, console, io */

angular.module('levelPad').controller('AuthController', ['$scope', '$route', '$location', '$http', '$log', 'AuthService', function ($scope, $route, $location, $http, $log, authService) {

	$scope.login = function() {
		// Workaround to ensure that angular js has the actual data when user
		// user autofill in chrome! More about this topic could found in this
		// bug report: https://github.com/angular/angular.js/issues/1072
		$('input').trigger('change');

		if (!$scope.username) {
			alert('Bitte E-Mail-Adresse eingeben.');
		} else if (!$scope.password) {
			alert('Bitte Passwort eingeben.');
		} else {
			authService.login($scope.username, $scope.password, function(error, loggedIn) {
				if (error) {
					alert('Login fehlgeschlagen!');
				} else {
					if ($location.$path == '/login') {
						$location.$path = '/';
					} else {
						$route.reload();
					}
				}
			});
		}
	};

	$scope.signup = function() {
		// Workaround to ensure that angular js has the actual data when user
		// user autofill in chrome! More about this topic could found in this
		// bug report: https://github.com/angular/angular.js/issues/1072
		$('input').trigger('change');

		$log.log('Signup user ' + $scope.username + '...');

		$http({
			method: 'POST',
			url: '/api/account',
			data: {
				username: $scope.username,
				password: $scope.password,
				email: $scope.email,
				studentNumber: $scope.studentNumber,
				firstname: $scope.firstname,
				lastname: $scope.lastname
			}
		}).success(function(response) {
			alert('Signup successful!');
			$log.error(response);
		}).error(function(response) {
			alert('Signup failed!');
			$log.error(response);
		});
	};

}]);
