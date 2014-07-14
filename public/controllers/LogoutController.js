angular.module('levelPad').controller('LogoutController', function($scope, $rootScope, $location, AUTH_EVENTS, Session, AuthService) {
	'use strict';

	$scope.logout = function() {
		AuthService.logout().then(function() {
			Session.destroy();
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
