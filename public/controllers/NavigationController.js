angular.module('levelPad').controller('NavigationController', ['$scope', '$rootScope', '$route', '$location', '$log', 'AuthService', 'AUTH_EVENTS', function ($scope, $rootScope, $route, $location, $log, AuthService, AUTH_EVENTS) {
	'use strict';

	$scope.$location = $location;
	$scope.user = AuthService.user;
	$scope.loggedIn = AuthService.isAuthenticated();
	$rootScope.$on(AUTH_EVENTS.loginRefreshed, function() {
		$scope.user = AuthService.user;
		$scope.loggedIn = AuthService.isAuthenticated();
	});

	$rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
		$scope.user = null;
		$scope.loggedIn = false;
	});

	/**
	 * Handles the navigation buttons and open the login / signup dialogs.
	 */
	$scope.login = function() {
		if ($location.path() !== '/login') {
			$location.path('/login');
		}
	};

	$scope.signup = function() {
		if ($location.path() !== '/signup') {
			$location.path('/signup');
		}
	};

	$scope.admin = function() {
		if ($location.path() !== '/modules') {
			$location.path('/modules');
		}
	};

	$scope.logout = function() {
		if ($location.path() !== '/logout') {
			$location.path('/logout');
		}
	};

}]);
