/* global angular, alert */

angular.module('levelPad').controller('AdminSubjectController', ['$scope', 'Module', 'Subject', function ($scope, Module, Subject) {
	'use strict';

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
		});

		$scope.semester = [
			{ key: 'sose', name: 'Sommersemester' },
			{ key: 'wise', name: 'Wintersemester' }
		];

		$scope.subjects = Subject.query(function() {

		}, function() {
			alert('Could not load subjects.');
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
