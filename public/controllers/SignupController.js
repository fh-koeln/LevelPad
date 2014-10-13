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
		AuthService.signup($scope.user).then(function(res) {
			Session.create(Date.now(), res.data);
			$rootScope.$broadcast(AUTH_EVENTS.signupSuccess);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed);
		}, function(res) {
			$rootScope.$broadcast(AUTH_EVENTS.signupFailed, res);
		}).finally(function() {
			$($event.target).find('button[type=submit]').button('reset');
		});
	};

	$rootScope.$on(AUTH_EVENTS.signupSuccess, function() {
		$location.path('/');
	});

	$rootScope.$on(AUTH_EVENTS.signupFailed, function(event, res) {
		if (typeof res.data.errors === 'object') {
			for (var errorName in res.data.errors) {
			    if (res.data.errors.hasOwnProperty(errorName)) {
			        AlertService.showError(res.data.errors[errorName].message, -1);
			    }
			}
		} else {
			AlertService.showError('Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', -1);
		}
	});

});
