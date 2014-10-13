
angular.module('levelPad').controller('ModuleDetailController', [
	'$scope', '$routeParams', '$log', 'DialogService', 'Module', 'Subject', 'CurrentModule',
	function ($scope, $routeParams, $log, DialogService, Module, Subject, CurrentModule) {

	'use strict';
	console.log('ModuleDetailController: routeParams:', $routeParams);

	$scope.module = $scope.module || CurrentModule || new Module();

	$scope.update = function () {
		$scope.semester = [
			{ key: 'sose', name: 'Sommersemester' },
			{ key: 'wise', name: 'Wintersemester' }
		];

		// Get all subjects for the current module
		if ($scope.module) {
			Subject.query({
				module: $scope.module
			}, function(subjects) {
				$scope.subjects = subjects;
			}, function() {
				$log.error('Could not load subjects.');
			});
		}
	};
	$scope.update();

	// Notice: The following scope variables will be prefilled when
	// this detail controller is opened within another controller
	// in a modal dialog! So we must not override these callbacks here!

	if (!$scope.submit) {
		$scope.submit = function () {
			console.log('detail save scope', $scope);
			alert('detail save');
			$scope.module.$save(function () {
				$scope.update();
			}, function () {
				alert('Error!');
			});
		};
	}

	if (!$scope.delete) {
		$scope.delete = function () {
			$scope.module.$delete(function () {
				$scope.update();
			}, function () {
				alert('Error!');
			});
		};
	}

	if (!$scope.showDeleteDialog) {
		$scope.showDeleteDialog = function (module) {
			var dialog = new DialogService('/modules/:module/delete');
			dialog.scope.module = angular.copy(module);
			dialog.scope.submit = function () {
				dialog.scope.module.$save(function () {
					dialog.submit();
					$scope.update();
				}, function () {
					alert('Fehler!');
				});
			};
			dialog.open();
		};
	}

}]);
