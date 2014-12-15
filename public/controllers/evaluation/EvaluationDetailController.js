/* global angular, alert */

angular.module('levelPad').controller('EvaluationDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Member', 'Task', 'Evaluation', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'Grade', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Member, Task, Evaluation, DialogService, CurrentModule, CurrentSubject, CurrentTask, Grade, ChartOption ) {
		
		'use strict';
		
		$scope.subject = CurrentSubject;
		$scope.module = $routeParams.module;
		$scope.evaluation = new Evaluation();
		$scope.showComments = 0;
		
		
		function objectFindByKey(array, key, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][key] === value) {
					return array[i];
				}
			}
			return null;
		}
		
		$scope.update = function () {
			if ($routeParams.member) {
				$scope.member = Member.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member
				}, function () {
					Grade.prepareMember($scope);
				}
			)}
			
			var taskId = $routeParams.task || $scope.taskId;
			if (taskId) {
				$scope.task = Task.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: taskId
				}, function(){
						if ($routeParams.member) {
							$scope.evaluations = Evaluation.query({
								module: $routeParams.module,
								subject: $routeParams.subject,
								member: $routeParams.member
							},function(){
								var evaluation = objectFindByKey($scope.evaluations, 'task', $scope.task._id);
								if (evaluation){
									$scope.evaluation = evaluation;

								}else{
									$scope.evaluation.task = $scope.task._id;
									$scope.evaluation.level = "0";
								};	
							})
						};
				})};
			
			
		};
		
		$scope.update();
		
		$scope.updateGrades = function(scopeEvaluation){
			var evaluation = objectFindByKey($scope.member.evaluations, 'task', scopeEvaluation.task);
			console.log(scopeEvaluation);
			if(!evaluation && scopeEvaluation.level != 0){
				$scope.member.evaluations.push(scopeEvaluation);
			}else{
				$scope.member.evaluations = $scope.member.evaluations.filter(function(e){
					return e.task != evaluation.task;
				});
				if(scopeEvaluation.level!=0){
					console.log("try to remove");
					$scope.member.evaluations.push(scopeEvaluation);
				}
			}
			Grade.prepareMember($scope);
		};
		
		$scope._save = function() {
			console.log($scope.evaluation.level);
			if($scope.evaluation.level != 0){
				return $scope.evaluation.$save({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member,
				});
			}else if($scope.evaluation._id){
				return $scope.evaluation.$delete({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member,
					evaluation: $scope.evaluation._id
				}, function(){
					$scope.evaluation.level = "0";	
				});
			}else{
				
			}
		};
		
		$scope.save = $scope._save;
	
		//Pie Chart Magic
		$scope.options = ChartOption;
		
	}]);
