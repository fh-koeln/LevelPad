/* global alert */

angular.module('levelPad').controller('LevelDetailController', [
	'$scope', '$routeParams', '$location', '$http', '$log', 'DialogService', 'Level',
	function ($scope, $routeParams, $location, $http, $log, DialogService, Level) {

		'use strict';

		function prepareLevel() {
			if ($scope.level.isMinimum === undefined) {
				$scope.level.isMinimum = 'false';
			}
		}

		$scope.update = function() {
			if ($routeParams.module && $routeParams.subject && $routeParams.task && $routeParams.level ) {
				$scope.subject = Level.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: $routeParams.task,
					level: $routeParams.level
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
			return $scope.level.$save({
				module: $routeParams.module,
				subject: $routeParams.subject,
				task: $routeParams.task,
				level: $routeParams.level
			});
		};

		$scope._delete = function() {
			return $scope.level.$delete();
		};

		$scope.showDeleteDialog = function() {
			var dialog = new DialogService('/subjects/:subject/delete');
			dialog.scope.delete = function () {
				this._delete().then(function() {
					dialog.submit();
					$location.path('/');
				}, function () {
					alert('Fehler!');
				});
			};
			dialog.open();
		};

		$scope.showEditDialog = function() {
			var dialog = new DialogService('/subjects/:subject/edit');
			dialog.scope.submit = function() {
				this._save().then(function() {
					dialog.submit();
				}, function() {
					alert('Fehler!');
				});
			};
			dialog.scope.showConfirmDeleteDialog = function() {
				dialog.cancel();
				this.showDeleteDialog();
			};
			dialog.open();
		};
}]);
