angular.module('levelPad').controller('NavigationController', ['$scope', '$route', '$location', '$log', 'AuthService', function ($scope, $route, $location, $log, authService) {
    'use strict';

    $scope.items = [];

    for (var route in $route.routes) {
        if ($route.routes[route].title) {
            $scope.items.push({
                title: $route.routes[route].title,
                path: route
            });
        }
    }

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

	authService.$watch(function(user) {
		console.log('logged in: ' + authService.loggedIn + ' -- user: ' + authService.user)
		if (authService.loggedIn && authService.user) {
			// Is logged in
			$scope.hideLoginDialog();
			$scope.hideSignupDialog();
			if ($location.path() === '/' || $location.path() === '/login' || $location.path() === '/signup' || $location.path() === '/logout') {
				$location.path('/');
			}
		} else if (authService.loggedIn && !authService.user) {
			// Should be logged in
			$scope.showLoginDialog();
		}
	});

	/**
	 * Handles the navigation buttons and open the login / signup dialogs.
	 */

    $scope.login = function() {
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