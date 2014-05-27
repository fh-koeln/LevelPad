angular.module('levelPad').controller('AccountController', ['$scope', '$location', 'AuthService', function ($scope, $location, authService) {
	'use strict';

	/**
	 * Note: The user is available in the rootScope!
	 *
	 * See AccountService for more details. This was also used in the navigation partial.
	 */

	// Workaround to ensure that angular js has the actual data when user
	// user autofill in chrome! More about this topic could found in this
	// bug report: https://github.com/angular/angular.js/issues/1072
	var updateInputFields = function() {
		$('input').trigger('change');
	};

	/**
	 * Handles login / signup submit buttons.
	 */

	$scope.login = function($event) {
		updateInputFields();
		var user = {
			username: $scope.username,
			password: $scope.password
		};

		$($event.target).find('button[type=submit]').button('loading');
		authService.login(user, function(err, user) {
			$($event.target).find('button[type=submit]').button('reset');
			if (!err) {
				$location.path('/');
			}
		});
	};

	$scope.signup = function($event) {
		updateInputFields();
		var user = {
			username: $scope.username,
			password: $scope.password,
			email: $scope.email,
			studentNumber: $scope.studentNumber,
			firstname: $scope.firstname,
			lastname: $scope.lastname
		};

		$($event.target).find('button[type=submit]').button('loading');
		authService.signup(user, function(err, user) {
			$($event.target).find('button[type=submit]').button('reset');
			if (!err) {
				$location.path('/');
			}
		});
	};

	$scope.logout = function($event) {
		authService.logout(function(err) {
			if (!err) {
				$location.path('/');
			}
		});
	};

}]);
