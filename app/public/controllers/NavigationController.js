angular.module('levelPad').controller('NavigationController', ['$scope', '$rootScope', '$route', '$location', '$log', 'AuthService', 'AUTH_EVENTS', 'Session', function ($scope, $rootScope, $route, $location, $log, AuthService, AUTH_EVENTS, Session) {
	'use strict';

	$scope.$location = $location;

	$scope.user = Session.user;
	$scope.loggedIn = false;
	$rootScope.$on(AUTH_EVENTS.loginRefreshed, function() {
		$scope.user = Session.user;
		$scope.loggedIn = true;
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

	$scope.logout = function() {
		if ($location.path() !== '/logout') {
			$location.path('/logout');
		}
	};

}]);
