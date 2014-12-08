/* global angular, alert */

angular.module('levelPad').controller('LevelListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Level', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Level, DialogService) {

	'use strict';

	$scope.subject = $routeParams.subject;
	$scope.module = $routeParams.module;
	$scope.task = $routeParams.task;

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

        //$scope.levels.splice(end, 0,
        //   $scope.levels.splice(start, 1)[0]);
		$scope.levels[start].rank = end+1;

		console.log($scope.levels);

		$scope.levels.sort(function (a, b) {
    		return a.rank > b.rank;
  		});

        $scope.$apply();
    };

	$scope.sortableOptions = {
		'handle': '.myHandle',
		start: $scope.dragStart,
        update: $scope.dragEnd
	};

}]);
