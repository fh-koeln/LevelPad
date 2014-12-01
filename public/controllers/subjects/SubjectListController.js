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

		var dialog = new DialogService('/subjects/new');

		dialog.scope.submit = function() {
			var module = this.subject.module;
			delete this.subject.module;

			this.subject.registrationExpiresAt = this.subject.registrationExpiresAt.timestamp;

			if (this.subject.registrationActive === '0') {
				this.subject.registrationExpiresAt = 0;
			}

			if (this.subject._registrationPasswordCheck === '0') {
				this.subject.registrationPassword = '';
			}

			delete this.subject._registrationPasswordCheck;

			this.subject.$save({module: module.slug}, function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};

		dialog.open();
	};

}]);
