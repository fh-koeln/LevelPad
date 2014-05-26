angular.module('levelPad').controller('AccountController', ['$scope', '$route', '$location', '$log', 'AuthService', function ($scope, $route, $location, $log, authService) {
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

	$scope.login = function() {
		updateInputFields();
		authService.login({
			username: $scope.username,
			password: $scope.password
		});
	};

	$scope.signup = function() {
		updateInputFields();
		authService.signup({
			username: $scope.username,
			password: $scope.password,
			email: $scope.email,
			studentNumber: $scope.studentNumber,
			firstname: $scope.firstname,
			lastname: $scope.lastname
		});
	};

	$scope.logout = function() {
		authService.logout();
	};

}]);
