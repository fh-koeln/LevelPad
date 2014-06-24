angular.module('levelPad').controller('LoginController', function ($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {
	'use strict';

	$scope.credentials = {
		username: '',
		password: ''
	};

	$scope.login = function (credentials) {
		AuthService.login(credentials).then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};

	$rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
		$location.path('/');
	});
});
