angular.module('levelPad').controller('AccountController', ['$scope', '$http', '$location', 'AuthService', 'User', 'Session', 'AlertService', function ($scope, $http, $location, authService, User, Session, AlertService) {
	'use strict';

	/**
	 * IMPORTANT NOTE: The user is already available in the rootScope!
	 * See AccountService for more details, the origin instance was also used in the
	 * navigation partial for example.
	 *
	 * But we copy them here to the current scope so that the user could change
	 * here an independent model! ;-)
	 */
	$scope.user = angular.copy($scope.$parent.user);

	/**
	 * Handles logged in "save account" button.
	 */

	$scope.save = function($event) {

		// TODO verify which fields could be saved here...
		var user = {
			username: $scope.user.username,
			email: $scope.user.email,
			studentNumber: $scope.user.studentNumber,
			firstname: $scope.user.firstname,
			lastname: $scope.user.lastname
		};

		$($event.target).find('button[type=submit]').button('loading');
		new User(user).$save(function() {
			$($event.target).find('button[type=submit]').button('reset');
			alert('OK');
		}, function() {
			$($event.target).find('button[type=submit]').button('reset');
			alert('Error!');
		});

	};

	/**
	 * Handles login / signup submit buttons.
	 */

	/*$scope.login = function($event) {
		// Workaround to ensure that angular js has the actual data when user
		// user autofill in chrome! More about this topic could found in this
		// bug report: https://github.com/angular/angular.js/issues/1072
		$('input').trigger('change');

		var user = {
			username: $scope.username,
			password: $scope.password
		};

		$($event.target).find('button[type=submit]').button('loading');
		$http({
			method: 'POST',
			url: '/api/login',
			data: user
		}).success(function(response) {
			$($event.target).find('button[type=submit]').button('reset');
			if (response && response.role !== 'guest') {
			$location.path('/');
			}
		}).error(function(response) {
			$($event.target).find('button[type=submit]').button('reset');
			AlertService.showError('Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
			console.error(response);
		});
	};

	$scope.signup = function($event) {
		// Workaround to ensure that angular js has the actual data when user
		// user autofill in chrome! More about this topic could found in this
		// bug report: https://github.com/angular/angular.js/issues/1072
		$('input').trigger('change');

		var user = {
			username: $scope.username,
			password: $scope.password,
			email: $scope.email,
			studentNumber: $scope.studentNumber,
			firstname: $scope.firstname,
			lastname: $scope.lastname
		};

		$($event.target).find('button[type=submit]').button('loading');
		authService.signup(user, function(err) {
			$($event.target).find('button[type=submit]').button('reset');
			if (!err) {
				$location.path('/');
			}
		});
	};

	$scope.logout = function() {
		authService.logout(function(err) {
			if (!err) {
				$location.path('/');
			}
		});
	};*/

}]);
