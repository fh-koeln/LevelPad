/* global angular, alert */

angular.module('levelPad').controller('MemberDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'CurrentModule', 'CurrentSubject', 'CurrentMember', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Member, CurrentModule, CurrentSubject, CurrentMember, ChartOption) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		$scope.member = CurrentMember;

		console.log('member:', $scope.member);

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.update = function() {
			$scope.modules = Module.query(function() {

			}, function() {
				alert('Could not load modules.');
			});
		};

		$scope.update();

		$scope.showCreateDialog = function() {
			var dialog = new DialogService('/tasks/new');
			dialog.scope.task = new Task();
			dialog.scope.submit = function() {
				dialog.scope.module.$save(function() {
					dialog.submit();
					$scope.update();
				}, function() {
					alert('Fehler!');
				});
			};
			dialog.open();
		};

		//Pie Chart Magic
		$scope.options = ChartOption;
		$scope.task ={
			amountRange: 50
		};

		$scope.$watch(
			function( $scope ) {
				return( $scope.task.amountRange );
			},
			function( newValue ) {
				newValue = parseInt(newValue, 10);
				$scope.data = [
					{
						title:'Learning Outcome',
						value: newValue,
						color: '#77cc00',
						highlight: '#88dd11'
					},
					{
						title:'Rest',
						value: 100 - newValue,
						color:'lightgray',
						highlight: 'lightgray'
					}
				];
			}
		);
	}]);