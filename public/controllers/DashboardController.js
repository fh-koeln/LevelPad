/* global angular, alert */

angular.module('levelPad').controller('DashboardController', [
	'$scope', '$rootScope', '$http', 'AUTH_EVENTS', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Session',
	function ($scope, $rootScope, $http, AUTH_EVENTS, $routeParams, $location, $log, Module, Subject, Session) {
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

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.showCreateDialog = function() {
			$scope.subject = new Subject();
			$('#edit').modal();
		};

		$scope.showEditDialog = function(subject) {
			$scope.subject = angular.copy(subject);
			$('#edit').modal();
		};

		$scope.showDeleteDialog = function(subject) {
			$scope.subject = angular.copy(subject);
			$('#delete').modal();
		};

		$scope.hideDialog = function() {
			$('#edit, #delete').modal('hide');
			$scope.subject = null;
		};

		$scope.save = function() {
			console.log('save:', $scope.subject);
			$scope.subject.module = $scope.module;
			$scope.subject.$save(function() {
				$scope.hideDialog();
				$scope.update();
			}, function() {
				alert('Error!');
			});
		};

		$scope.delete = function() {
			$scope.subject.$delete(function() {
				$scope.hideDialog();
				$scope.update();
			}, function() {
				alert('Error!');
			});
		};

		$scope.reload();
	}]);
