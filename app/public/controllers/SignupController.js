angular.module('levelPad').controller('SignupController', function($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {
	'use strict';

	var user = {
		username: '',
		email: '',
		studentNumber: '',
		firstname: '',
		lastname: ''
	};

	$scope.user = user;

	$scope.signup = function($event) {
		$($event.target).find('button[type=submit]').button('loading');
		AuthService.signup($scope.user).then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
		}).finally(function() {
			$($event.target).find('button[type=submit]').button('reset');
		});
	};

});
