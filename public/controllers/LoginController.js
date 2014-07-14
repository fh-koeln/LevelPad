angular.module('levelPad').controller('LoginController', function($scope, $rootScope, $location, AUTH_EVENTS, AuthService, AlertService, Session, USER_ROLES) {
	'use strict';

	$scope.credentials = {
		username: '',
		password: ''
	};

	$scope.login = function($event) {
		$($event.target).find('button[type=submit]').button('loading');
		AuthService.login($scope.credentials).then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		}).finally(function() {
			$($event.target).find('button[type=submit]').button('reset');
		});
	};

	$rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
		var user = Session.user;
		if (user.role !== USER_ROLES.guest) {
			$location.path('/');
		} else {
			$location.path('/signup');
		}
	});

	$rootScope.$on(AUTH_EVENTS.loginFailed, function() {
		AlertService.showError('Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', -1);
	});
});
