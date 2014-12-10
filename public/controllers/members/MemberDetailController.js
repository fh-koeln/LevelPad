/* global angular, alert */

angular.module('levelPad').controller('MemberDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'CurrentModule', 'CurrentSubject', 'CurrentMember', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Member, CurrentModule, CurrentSubject, CurrentMember, ChartOption) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		
		var relGrade = 0;
		var weightSum = 0;
		
		
		function objectFindByKey(array, key, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][key] === value) {
					return array[i];
				}
			}
			return null;
		}

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.update = function() {
			if ($routeParams.member) {
				$scope.member = Member.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member
				}, function () {
					prepareMember();
				}
			)}
		};

		$scope.update();
		
		console.log('member:', $scope.member);
		console.log('Current module', CurrentModule);
		console.log('Current subject', CurrentSubject);

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
		
		function relativeGrade(){
			angular.forEach($scope.subject.tasks, function(task) {
				var countMin = 0;
				var evaluation = objectFindByKey($scope.member.evaluations, 'task', task._id);
				
				if (evaluation){
					weightSum += task.weight;
					var level = objectFindByKey(task.levels, '_id', evaluation.level);
					angular.forEach(task.levels, function(level) {
						if(level.isMinimum == true){
							countMin +=1;
						}
					});
					if(level){
						task.level = level;
					}
					relGrade+= (3/(countMin-1) * (task.level.rank -1) +1) * task.weight;
				}
				
			});
			relGrade = relGrade / weightSum;
			console.log(relGrade);
			
			return relGrade
		};
		
		function prepareMember() {
			$scope.relGrade = Math.round( relativeGrade() * 100) / 100;
			
			$scope.member._artefacts = [
				{
					title:'Artefakte',
					value: $scope.member.evaluations.length,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.subject.tasks.length - $scope.member.evaluations.length,
					color:'lightgray',
					highlight: 'lightgray'
				}
			];
			$scope.member.relGrade = [
				{
					title:'Note',
					value: 1/$scope.relGrade,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: 1 - 1/$scope.relGrade,
					color:'lightgray',
					highlight: 'lightgray'
				}
			];
			
			angular.forEach($scope.subject.tasks, function(task) {
				task._taskWeight = [
					{
						title:'Task',
						value: task.weight,
						color: '#77cc00',
						highlight: '#88dd11'
					},
					{
						title:'Rest',
						value: 100- task.weight,
						color:'lightgray',
						highlight: 'lightgray'
					}
				];
				
				var evaluation = objectFindByKey($scope.member.evaluations, 'task', task._id);
				if (evaluation){
					var level = objectFindByKey(task.levels, '_id', evaluation.level);
					if(level){
						task.level = level;
					}
				}
				
			});
		}

	}]);
