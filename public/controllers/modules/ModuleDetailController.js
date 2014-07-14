
angular.module('levelPad').controller('ModuleDetailController', [
	'$scope', '$routeParams', '$log', 'Module', 'Subject', 'CurrentModule',
	function ($scope, $routeParams, $log, Module, Subject, CurrentModule) {

	'use strict';
	$scope.module = CurrentModule;

	console.log('SubjectsController: routeParams:', $routeParams);

	$scope.update = function () {
		$scope.semester = [
			{ key: 'sose', name: 'Sommersemester' },
			{ key: 'wise', name: 'Wintersemester' }
		];

		// Get all subjects for the current module
		Subject.query({
			module: CurrentModule
		}, function(subjects) {
			$scope.subjects = subjects;
		}, function() {
			$log.error('Could not load subjects.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		$scope.subject = new Subject();
		$('#edit').modal();
	};

	$scope.showEditDialog = function(subject) {
		$scope.subject = angular.copy(subject);
		$('#edit').modal();
	};

	$scope.showDeleteDialog = function(subject) {
		$scope.subject = angular.copy(subject);
		$('#delete').modal();
	};

	$scope.hideDialog = function() {
		$('#edit, #delete').modal('hide');
		$scope.subject = null;
	};

	$scope.save = function() {
		console.log('save:', $scope.subject);
		$scope.subject.module = $scope.module;
		$scope.subject.$save(function() {
			$scope.hideDialog();
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};

	$scope.delete = function() {
		$scope.subject.$delete(function() {
			$scope.hideDialog();
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};

}]);
