angular.module('levelPad').controller('NavigationController', ['$scope', '$rootScope', '$route', '$location', '$log', 'AuthService', 'AUTH_EVENTS', 'Session', function ($scope, $rootScope, $route, $location, $log, AuthService, AUTH_EVENTS, Session) {
	'use strict';

	$scope.$location = $location;

	$scope.user = null;
	$scope.loggedIn = false;

	$rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
		$scope.user = Session.user;
		$scope.loggedIn = true;
	});

	$rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
		$scope.user = Session.user;
		$scope.loggedIn = true;
		$location.path('/');
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
		AuthService.logout().then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
		});
	};

}]);
