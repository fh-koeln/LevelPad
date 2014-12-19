/* global angular, alert */

angular.module('levelPad').controller('LevelListController', [
	'$scope', '$http', '$stateParams', '$location', '$log', 'Level', 'DialogService',
	function ($scope, $http, $stateParams, $location, $log, Level, DialogService) {

	'use strict';

	$scope.subject = $stateParams.subject;
	$scope.module = $stateParams.module;
	$scope.task = $stateParams.task;

	$scope.update = function () {
		Level.query({ module: $stateParams.module, subject: $stateParams.subject, task: $stateParams.task }, function(levels) {
			$scope.levels = levels;
			$scope.levels.sort( function(a, b){
				return a.rank > b.rank
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

        $scope.levels.splice(end, 0, $scope.levels.splice(start, 1)[0]);
		console.log($scope.levels);
		var index=0;
        angular.forEach($scope.levels, function(level) {
			console.log(index);
        	level.rank = index+1;
			level.$save({
				module: $stateParams.module,
				subject: $stateParams.subject,
				task: $stateParams.task,
				level: level._id
			});
			index++;
      	});
		$scope.$apply();
    };

	$scope.sortableOptions = {
		'handle': '.myHandle',
		start: $scope.dragStart,
        update: $scope.dragEnd
	};
}]);
