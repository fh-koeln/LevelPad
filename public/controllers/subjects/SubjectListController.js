/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, DialogService) {

	'use strict';

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

		$scope.subject = new Subject();

		var dialog = new DialogService('/subjects/new', $scope.subject);
		dialog.scope.subject = false;

		dialog.scope.submit = function() {

			console.log(dialog.scope);
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

}]);
