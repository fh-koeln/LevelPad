/* global angular, alert */

angular.module('levelPad').controller('SubjectController', ['$scope', '$location', '$log', '$resource', function ($scope, $location, $log, $resource) {
	'use strict';

	var Subject = $resource('/api/subjects/:slug', { slug: '@slug' });

	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.update = function() {
		$scope.subjects = Subject.query(function() {
			$scope.subject = $scope.subjects[0];
		}, function() {
			alert('Could not load subjects.');
		});
	};
	$scope.update();

	$scope.teams = [
		{
			students: [
				{ name: 'Dominik' },
				{ name: 'Dennis' }
			]
		},
		{
			students: [
				{ name: 'Ben'},
				{ name: 'Dario'}
			]
		}
	];

	$scope.tasks = [
		{
			title: 'Hallo'
		}
	]

	$scope.students = [
		{ name: 'Dominik' },
		{ name: 'Dennis '},
		{ name: 'Ben'},
		{ name: 'Dario'}
	];

	$scope.assistants = [
		{ name: 'Volker '}
	];

}]);
