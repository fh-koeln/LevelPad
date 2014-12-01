/* global angular, alert */

angular.module('levelPad').controller('DashboardController', [
	'$scope', '$rootScope', '$http', 'AUTH_EVENTS', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Session',
	function ($scope, $rootScope, $http, AUTH_EVENTS, $routeParams, $location, $log, DialogService, Module, Subject, Session) {
		'use strict';

		$scope.user = Session.user ? Session.user : null;
		$rootScope.$on(AUTH_EVENTS.loginRefreshed, function() {
			$scope.user = Session.user;
			$scope.reload();
		});

		$rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
			$scope.user = null;
			$scope.reload();
		});

		$scope.reload = function () {
			var username = $scope.user ? $scope.user.username : null;
			var filter = {};
			var config = {
				params: filter
			};

			if (!username) {
				return;
			}

			// Get all subjects for the current module
			$http.get('/api/users/' + username + '/subjects', config).success(function(subjects) {
				$scope.subjects = subjects;
			});
		};

		$scope.update = function() {
			$scope.reload();
		};

		$scope.showCreateDialog = function() {
			var dialog = new DialogService('/subjects/new');
			dialog.scope.subject = new Subject();

			dialog.scope.submit = function() {
				var module = dialog.scope.subject.module;
				delete dialog.scope.subject.module;
				dialog.scope.subject.registrationExpiresAt = dialog.scope.subject.registrationExpiresAt.timestamp;
				dialog.scope.subject.year = dialog.scope.subject.year.year;
				dialog.scope.subject.semester = dialog.scope.subject.semester.name;

				if (dialog.scope.subject.registrationActive === '0') {
					dialog.scope.subject.registrationExpiresAt = 0;
				}

				if (dialog.scope.subject._registrationPasswordCheck === '0') {
					dialog.scope.subject.registrationPassword = '';
				}

				delete dialog.scope.subject._registrationPasswordCheck;

				dialog.scope.subject.$save({module: module.slug}, function() {
					dialog.submit();
					$scope.update();
				}, function() {
					alert('Fehler!');
				});
			};
			dialog.open();
		};

		$scope.reload();
	}]);
