angular.module('levelPad').controller('MainController', function ($rootScope, $scope, USER_ROLES, AuthService, AUTH_EVENTS) {
	'use strict';


	$rootScope.$on('$stateChangeStart', function (event, next) {
		var authorizedRoles = next.data.authorizedRoles;
		if (!AuthService.isAuthorized(authorizedRoles)) {
			event.preventDefault();
			if (AuthService.isAuthenticated()) {
				console.log("user is isAuthenticated");
				// user is not allowed
				$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			} else {
				console.log("user is not isAuthenticated");
				// user is not logged in
				$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			}
		}
	});
});
