/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, DialogService) {

	'use strict';

	$scope.update = function () {
		$scope.subjects = [];
		// Get all subjects for all modules
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
			this._save().then(function() {
				$scope.update();
				dialog.submit();
			}, function() {
				alert('Fehler!');
			});
		};

		dialog.open();
	};

}]);
