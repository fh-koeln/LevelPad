angular.module('levelPad').controller('SignupController', function($scope, $rootScope, $location, AUTH_EVENTS, AuthService, Session, AlertService) {
	'use strict';

	var user = {
		username: Session.user ? Session.user.username : '',
		email: '',
		studentNumber: '',
		firstname: '',
		lastname: ''
	};

	$scope.user = user;

	$scope.signup = function($event) {
		$scope.user.username = Session.user.username;

		$($event.target).find('button[type=submit]').button('loading');
		AuthService.signup($scope.user).then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.signupSuccess);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.signupFailed);
		}).finally(function() {
			$($event.target).find('button[type=submit]').button('reset');
		});
	};

	$rootScope.$on(AUTH_EVENTS.signupSuccess, function() {
		$location.path('/');
	});

	$rootScope.$on(AUTH_EVENTS.signupFailed, function() {
		AlertService.showError('Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', -1);
	});

});
