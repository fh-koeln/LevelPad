/* global angular, alert */

angular.module('levelPad').controller('AdminSubjectController', ['$scope', '$log', '$resource', function ($scope, $log, $resource) {
	'use strict';

	var Module = $resource('/api/modules');

	var Subject = $resource('/api/subjects/:year/:semester/:module', {
		year: '@year',
		semester: '@semester',
		module: '@module.shortName'
	}, {
		save: { method: 'PUT' }
	});

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
		});

		$scope.semester = [
			{ key: 'ss', name: 'Sommersemester' },
			{ key: 'ws', name: 'Wintersemester' }
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
