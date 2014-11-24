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

		function zeroize(x) {
			return (x < 10) ? '0' + x : x;
		}

		function getExpireDates() {
			var dates = [],
				today, actualDate, todayInTwoWeeks;

			actualDate = new Date(),
			today = new Date(actualDate.getFullYear(), actualDate.getMonth() ,actualDate.getDate(), 23, 59, 59);
			todayInTwoWeeks = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);

			dates.push({
				name: 'Unbeschränkt',
				timestamp: -1
			});

			while (today <= todayInTwoWeeks) {
				dates.push({
					name: zeroize(today.getDate()) + '.' +  zeroize(today.getMonth() + 1) + '.' + today.getFullYear(),
					timestamp: today.getTime()
				});
				today.setDate(today.getDate() + 1);
			}

			return dates;
		}

		$scope.showCreateDialog = function() {
			var dialog = new DialogService('/subjects/new');
			dialog.scope.subject = new Subject();
			dialog.scope.years = $scope.years;
			dialog.scope.semesters = $scope.semesters;
			dialog.scope.expireDates = getExpireDates();
			dialog.scope.subject.registrationExpiresAt = dialog.scope.expireDates[0].timestamp;
			dialog.scope.subject.registrationActive = 1;
			console.log(dialog.scope.subject);
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
