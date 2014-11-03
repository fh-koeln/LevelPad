/* global angular, alert */

angular.module('levelPad').controller('SubjectDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, CurrentModule, CurrentSubject) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;

		$scope.update = function() {
			$scope.modules = Module.query(function() {

			}, function() {
				alert('Could not load modules.');
			});
		};
		$scope.update();

        $scope.showCreateDialog = function() {
			var dialog = new DialogService('/subjects/new');
			dialog.scope.subject = new Subject();
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


		$scope.assistants = [
			{ name: 'Volker '}
		];

}]);
