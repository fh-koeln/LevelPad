angular.module('levelPad').controller('SignupController', function($scope, $rootScope, $location, AUTH_EVENTS, AuthService, AlertService) {
	'use strict';

	$scope.user = {
		username: AuthService.user.username,
		email: '',
		studentNumber: '',
		firstname: '',
		lastname: ''
	};

	$scope.signup = function($event) {
		$($event.target).find('button[type=submit]').button('loading');
		AuthService.signup($scope.user).finally(function() {
			$($event.target).find('button[type=submit]').button('reset');
		});
	};

	$rootScope.$on(AUTH_EVENTS.signupSuccess, function() {
		$location.path('/');
	});

	$rootScope.$on(AUTH_EVENTS.signupFailed, function(event, res) {
		if (typeof res.errors === 'object') {
			for (var errorName in res.errors) {
				if (res.errors.hasOwnProperty(errorName)) {
					AlertService.showError(res.errors[errorName].message, -1);
				}
			}
		} else {
			AlertService.showError('Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', -1);
		}
	});

});
