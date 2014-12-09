/* global angular, alert */

angular.module('levelPad').controller('MemberListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Member', 'DialogService', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Member, DialogService, ChartOption) {

		'use strict';





		$scope.update = function() {
			// Get all member for the current module and subject.
			$scope.members = Member.query({ module: $routeParams.module, subject: $routeParams.subject }, function(members) {

			}, function() {
				alert('Could not load tasks.');
			});
		};
		$scope.update();

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

		$scope.member = [
		{
			name: 'Peeta'
		}
		];

		$scope.update = function() {

		};

		$scope.update();

	}]);
