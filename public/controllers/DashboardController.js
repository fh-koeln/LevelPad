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

		$http.get('/api/years').success(function(years) {
			$scope.years = years;
		});

		$http.get('/api/semesters').success(function(semesters) {
			$scope.semesters = semesters;
		});

		function generatePassword(subject) {
			var tempPassword = '',
				temp;

			for(var i = 0; i < 10; i++) {
				 temp = 0;
				while(!((temp > 48 && temp < 57) || (temp > 65 && temp < 90) || (temp > 97 && temp < 122))) {
					temp = Math.floor(Math.random() * 74) + 48;
				}
				tempPassword += String.fromCharCode(temp);
			}
			subject.registrationPassword = tempPassword;
		}

		$scope.showCreateDialog = function() {
			var dialog = new DialogService('/subjects/new');
			dialog.scope.subject = new Subject();
			dialog.scope.years = $scope.years;
			dialog.scope.semesters = $scope.semesters;
			generatePassword(dialog.scope.subject);
			dialog.scope.generatePassword = function() { generatePassword(dialog.scope.subject); };
			dialog.scope.submit = function() {
				dialog.scope.module.$save(function() {
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
