/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'DialogService', 'CurrentModule',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, DialogService, CurrentModule) {

	'use strict';
	$scope.module = $scope.module || CurrentModule || new Module();

	$scope.update = function () {
		$scope.subjects = [];
		// Get all subjects for the current module
		Module.query(function(modules) {
			angular.forEach(modules, function(module) {
				Subject.query({ module: module.slug}, function(subjects) {
					angular.forEach(subjects, function(subject) {
						$scope.subjects.push(subject);
					});
				});
			});
		}, function() {
			alert('Could not load subjects.');
		});
	};
	$scope.update();

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

	$scope.showEditDialog = function(subject) {
		var dialog = new DialogService('/subjects/:subject/edit');
		dialog.scope.subject = angular.copy(subject);
		dialog.scope.submit = function() {
			var module = dialog.scope.subject.module;
			delete dialog.scope.subject.module;
			if (dialog.scope.subject.registrationExpiresAt) {
				dialog.scope.subject.registrationExpiresAt = dialog.scope.subject.registrationExpiresAt.timestamp;
			}
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
		dialog.scope.showDeleteDialog = function() {
			dialog.cancel();
			$scope.showDeleteDialog(subject);
		};
		dialog.open();
	};

	$scope.showDeleteDialog = function(subject) {
		var dialog = new DialogService('/subjects/:subject/delete');
		dialog.scope.subject = angular.copy(subject);
		dialog.scope.delete = function() {
			dialog.scope.subject.$delete({module: subject.module.slug}, function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};

}]);
