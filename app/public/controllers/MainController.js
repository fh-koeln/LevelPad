angular.module('levelPad').controller('MainController', function ($rootScope, $scope, USER_ROLES, AuthService, AUTH_EVENTS) {
	'use strict';

	AuthService.refresh().then(function() {
		$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	}, function() {
		$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	});

	$rootScope.$on('$stateChangeStart', function (event, next) {
		var authorizedRoles = next.data.authorizedRoles;
		if (!AuthService.isAuthorized(authorizedRoles)) {
			event.preventDefault();
			if (AuthService.isAuthenticated()) {
				// user is not allowed
				$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			} else {
				// user is not logged in
				$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			}
		}
	});
});
