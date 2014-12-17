/* global alert */

angular.module('levelPad').controller('LevelDetailController', [
	'$scope', '$routeParams', '$location', '$http', '$log', 'DialogService', 'Level',
	function ($scope, $routeParams, $location, $http, $log, DialogService, Level) {

		'use strict';

		function prepareLevel() {
			if ($scope.level.isMinimum === undefined) {
				$scope.level.isMinimum = 'false';
			} else if ($scope.level.isMinimum === false) {
				$scope.level.isMinimum = 'false';
			} else if ($scope.level.isMinimum === true) {
				$scope.level.isMinimum = 'true';
			}
		}

		$scope.update = function() {
			var levelId = $routeParams.level || $scope.levelId;
			if ($routeParams.module && $routeParams.subject && $routeParams.task && levelId ) {
				$scope.level = Level.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: $routeParams.task,
					level: levelId
				}, function() {
					prepareLevel();
				});
			} else {
				$scope.level = new Level();
				prepareLevel();
			}
		};

		$scope.update();

		$scope._save = function() {
			var levelId = $routeParams.level || $scope.levelId;
			return $scope.level.$save({
				module: $routeParams.module,
				subject: $routeParams.subject,
				task: $routeParams.task,
				level: levelId
			});
		};

		$scope._delete = function() {
			var levelId = $routeParams.level || $scope.levelId;
			return $scope.level.$delete({
				module: $routeParams.module,
				subject: $routeParams.subject,
				task: $routeParams.task,
				level: levelId
			});
		};

		$scope.showDeleteDialog = function(level) {
			var dialog = new DialogService('/:module/:subject/tasks/:task/levels/:level/delete');
			dialog.scope.levelId = level._id;
			dialog.scope.delete = function () {
				this._delete().then(function() {
					dialog.submit();
					$route.reload();
				}, function () {
					alert('Fehler!');
				});
			};
			dialog.open();
		};
}]);
