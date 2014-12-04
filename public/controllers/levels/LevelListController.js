/* global angular, alert */

angular.module('levelPad').controller('LevelListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Level', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Level, DialogService) {

	'use strict';

	function prepareLevel(level) {
		level.descriptionItems = level.description.split('*');

		return level;
	}

	$scope.update = function () {
		$scope.levels = [];
		Level.query({ module: $routeParams.module, subject: $routeParams.subject, task: $routeParams.task }, function(tasks) {
			angular.forEach(tasks, function(level) {
				$scope.levels.push(prepareLevel(level));
			});
		}, function() {
			alert('Could not load levels.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/:module/:subject/tasks/:task/levels/new');
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
