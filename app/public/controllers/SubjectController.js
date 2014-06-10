/* global angular, alert */

angular.module('levelPad').controller('SubjectController', ['$scope', '$location', '$log', 'Subject', function ($scope, $location, $log, Subject) {
	'use strict';

	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.update = function() {
		console.log('x');
		$scope.subjects = Subject.query({
			module: 'wba1'
		}, function() {
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
