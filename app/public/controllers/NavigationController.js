angular.module('levelPad').controller('NavigationController', ['$scope', '$route', '$location', '$log', 'AuthService', function ($scope, $route, $location, $log, authService) {
	'use strict';

	$scope.$location = $location;

	/**
	 * Manages the login / signup dialogs
	 */

	$scope.showLoginDialog = function() {
		$log.info('Show modal login dialog...');
		$('#loginDialog').modal();
	};

	$scope.hideLoginDialog = function() {
		$log.info('Hide modal login dialog...');
		$('#loginDialog').modal('hide');
	};

	$scope.showSignupDialog = function() {
		$log.info('Show modal signup dialog...');
		$('#signupDialog').modal();
	};

	$scope.hideSignupDialog = function() {
		$log.info('Hide modal signup dialog...');
		$('#signupDialog').modal('hide');
	};

	authService.$watch(function() {
		console.log('logged in: ' + authService.loggedIn + ' -- user: ' + authService.user);
		if (authService.loggedIn && authService.user) {
			// Is logged in
			$scope.hideLoginDialog();

			if (authService.user.role === 'guest') {
				$scope.signup();
			} else {
				if ($location.path() === '/' || $location.path() === '/login' || $location.path() === '/signup' || $location.path() === '/logout') {
					$location.path('/');
				}
			}
		} else if (!authService.loggedIn || !authService.user) {
			// Should be logged in
			$scope.login();
		}
	});

	/**
	 * Handles the navigation buttons and open the login / signup dialogs.
	 */

	$scope.login = function() {
		if ($location.path() === '/') {
			return;
		}

		if ($location.path() === '/login' || $location.path() === '/signup') {
			$location.path('/login');
		} else {
			$scope.showLoginDialog();
		}
	};

	$scope.signup = function() {
		if ($location.path() === '/login' || $location.path() === '/signup') {
			$location.path('/signup');
		} else {
			$scope.showSignupDialog();
		}
	};

	$scope.logout = function() {
		authService.logout();
	};

	/**
	 * Automatically load the current user status to update the navigation bar fields.
	 */

	authService.verifyStatus();

}]);
