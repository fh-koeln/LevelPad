angular.module('levelPad').controller('AccountController', ['$scope', '$rootScope', '$http', '$location', 'AuthService', 'User', 'Session', 'AlertService', 'AUTH_EVENTS', function ($scope, $rootScope, $http, $location, AuthService, User, Session, AlertService, AUTH_EVENTS) {
	'use strict';

	$scope.user = {
		username: Session.user ? Session.user.username : '',
		email: Session.user ? Session.user.email : '',
		studentNumber: Session.user ? Session.user.studentNumber : '',
		firstname: Session.user ? Session.user.firstname : '',
		lastname: Session.user ? Session.user.lastname : '',
		role: Session.role ? Session.user.role : 'guest',
	};

	$rootScope.$on(AUTH_EVENTS.loginRefreshed, function() {
		$scope.user = {
			username: Session.user.username,
			email: Session.user.email,
			studentNumber: Session.user.studentNumber,
			firstname: Session.user.firstname,
			lastname: Session.user.lastname,
			role: Session.user.role
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
			username: Session.user.username,
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
