/* global angular, alert */

angular.module('levelPad').controller('StudentListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject, ChartOption) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;

	$scope.update = function() {
//		$scope.students = Student.query(function() {
//		}, function() {
//			alert('Es ist ein Fehler während des Laden aufgetreten.');
//		});
	};
	$scope.update();

	$scope.students = [
		{ name: 'Dominik' },
		{ name: 'Dennis '},
		{ name: 'Ben'},
		{ name: 'Dario'}
	];

	//Pie Chart Magic
	$scope.options = ChartOption;
	// Chart.js Data
	$scope.data = [
	  {
		title:'Learning Outcome',
		value: 20,
		color: '#77cc00',
		highlight: '#88dd11'
	  },
	  {
		title:'Rest',
		value: 100-20,
		color:'lightgray',
		highlight: 'lightgray'
	  }
	];	
		
}]);
