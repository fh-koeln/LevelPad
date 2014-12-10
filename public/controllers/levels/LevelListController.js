/* global angular, alert */

angular.module('levelPad').controller('LevelListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Level', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Level, DialogService) {

	'use strict';

	$scope.subject = $routeParams.subject;
	$scope.module = $routeParams.module;
	$scope.task = $routeParams.task;

	$scope.update = function () {
		Level.query({ module: $routeParams.module, subject: $routeParams.subject, task: $routeParams.task }, function(levels) {
			$scope.levels = levels;
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

	$scope.showEditDialog = function(level) {
		var dialog = new DialogService('/:module/:subject/tasks/:task/levels/:level/edit');
		dialog.scope.levelId = level._id;
		dialog.scope.submit = function() {
			this._save().then(function() {
				$scope.update();
				dialog.submit();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.scope.showConfirmDeleteDialog = function() {
			dialog.cancel();
			this.showDeleteDialog(level);
		};
		dialog.open();
	};

	$scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
    };
    $scope.dragEnd = function(e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();

        $scope.levels.splice(end, 0, $scope.levels.splice(start, 1)[0]);

        for(var index in $scope.levels) {
        	$scope.levels[index].rank = parseInt(index,10)+1;
			$scope.levels[index].$save({
				module: $routeParams.module,
				subject: $routeParams.subject,
				task: $routeParams.task,
				level: $scope.levels[index]._id
			});
      	}
		$scope.$apply();
    };

	$scope.sortableOptions = {
		'handle': '.myHandle',
		start: $scope.dragStart,
        update: $scope.dragEnd
	};
}]);
