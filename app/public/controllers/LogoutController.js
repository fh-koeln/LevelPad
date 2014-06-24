angular.module('levelPad').controller('LogoutController', function($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {
	'use strict';

	$scope.logout = function() {
		AuthService.logout().then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
		});
	};

	$rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
		$location.path('/');
	});

	$scope.logout();
});
