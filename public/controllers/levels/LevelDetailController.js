/* global alert */

angular.module('levelPad').controller('LevelDetailController', [
	'$scope', '$stateParams', '$location', '$http', '$log', 'DialogService', 'Level',
	function ($scope, $stateParams, $location, $http, $log, DialogService, Level) {

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
			var levelId = $stateParams.level || $scope.levelId;
			if ($stateParams.module && $stateParams.subject && $stateParams.task && levelId ) {
				$scope.level = Level.get({
					module: $stateParams.module,
					subject: $stateParams.subject,
					task: $stateParams.task,
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
			var levelId = $stateParams.level || $scope.levelId;
			return $scope.level.$save({
				module: $stateParams.module,
				subject: $stateParams.subject,
				task: $stateParams.task,
				level: levelId
			});
		};

		$scope._delete = function() {
			var levelId = $stateParams.level || $scope.levelId;
			return $scope.level.$delete({
				module: $stateParams.module,
				subject: $stateParams.subject,
				task: $stateParams.task,
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
