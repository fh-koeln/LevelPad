angular.module('levelPad').controller('AccountController', ['$scope', '$rootScope', '$http', '$location', 'AuthService', 'User', 'AlertService', 'AUTH_EVENTS', function ($scope, $rootScope, $http, $location, AuthService, User, AlertService, AUTH_EVENTS) {
	'use strict';

	$scope.user = {
		username: AuthService.user ? AuthService.user.username : '',
		email: AuthService.user ? AuthService.user.email : '',
		studentNumber: AuthService.user ? AuthService.user.studentNumber : '',
		firstname: AuthService.user ? AuthService.user.firstname : '',
		lastname: AuthService.user ? AuthService.user.lastname : '',
		role: AuthService.user ? AuthService.user.role : 'guest',
	};

	$rootScope.$on(AUTH_EVENTS.loginRefreshed, function() {
		$scope.user = {
			username: AuthService.user.username,
			email: AuthService.user.email,
			studentNumber: AuthService.user.studentNumber,
			firstname: AuthService.user.firstname,
			lastname: AuthService.user.lastname,
			role: AuthService.user.role
		};
	});

	$scope.roles = [
		{ role: 'guest', name: 'Gast' },
		{ role: 'lecturer', name: 'Professor' },
		{ role: 'student', name: 'Student' },
		{ role: 'assistant', name: 'Assistant' },
		{ role: 'administrator', name: 'Administrator' },
	];

	/**
	 * Handles logged in "save account" button.
	 */

	$scope.save = function($event) {

		var user = {
			username: AuthService.user.username,
			email: $scope.user.email,
			studentNumber: $scope.user.studentNumber,
			firstname: $scope.user.firstname,
			lastname: $scope.user.lastname,
			role: $scope.user.role
		};

		$($event.target).find('button[type=submit]').button('loading');
		new User(user).$update(function() {
			// TODO: Workaround to fetch new user data.
			AuthService.refresh();
			AlertService.showSuccess('Die Einstellungen wurden erfolgreich gespeichert.');
		}, function() {
			AlertService.showError('Die Einstellungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.', -1);
		}).finally(function() {
			$($event.target).find('button[type=submit]').button('reset');
		});
	};

}]);
