/* global angular, alert */

angular.module('levelPad').controller('EvaluationDetailController', [
	'$scope', '$stateParams', '$location', '$log', 'Module', 'Subject', 'Member', 'Task', 'Evaluation', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'Grade', 'ChartOption',
	function ($scope, $stateParams, $location, $log, Module, Subject, Member, Task, Evaluation, DialogService, CurrentModule, CurrentSubject, CurrentTask, Grade, ChartOption ) {

		'use strict';

		$scope.subject = CurrentSubject;
		$scope.module = $stateParams.module;
		$scope.$location = $location;
		$scope.evaluation = new Evaluation();


		function objectFindByKey(array, key, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][key] === value) {
					return array[i];
				}
			}
			return null;
		}

		$scope.update = function () {
			if ($stateParams.member) {
				$scope.member = Member.get({
					module: $stateParams.module,
					subject: $stateParams.subject,
					member: $stateParams.member
				}, function () {
					Grade.prepareMember($scope);
				}
			)}
			console.log($scope.member);
			var taskId = $stateParams.task || $scope.taskId;
			if (taskId) {
				$scope.task = Task.get({
					module: $stateParams.module,
					subject: $stateParams.subject,
					task: taskId
				}, function(){
						if ($stateParams.member) {
							$scope.evaluations = Evaluation.query({
								module: $stateParams.module,
								subject: $stateParams.subject,
								member: $stateParams.member
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
			if(!evaluation && scopeEvaluation.level != 0){
				$scope.member.evaluations.push(scopeEvaluation);
			}else{
				$scope.member.evaluations = $scope.member.evaluations.filter(function(e){
					return e.task != evaluation.task;
				});
				if(scopeEvaluation.level!=0){
					$scope.member.evaluations.push(scopeEvaluation);
				}
			}
			Grade.prepareMember($scope);
		};

		$scope._save = function() {
			if($scope.evaluation.level != 0){
				return $scope.evaluation.$save({
					module: $stateParams.module,
					subject: $stateParams.subject,
					member: $stateParams.member,
				});
			}else if($scope.evaluation._id){
				return $scope.evaluation.$delete({
					module: $stateParams.module,
					subject: $stateParams.subject,
					member: $stateParams.member,
					evaluation: $scope.evaluation._id
				}, function(){
					$scope.evaluation.level = "0";
				});
			}else{

			}
		};

		$scope.save = function(){
			$scope._save().then(function() {
				$location.path('/'+$stateParams.module+'/'+$stateParams.subject+'/members/'+$stateParams.member);
			}, function () {
					alert('Speichern fehlgeschlagen!');
			});
		};

		//Pie Chart Magic
		$scope.options = ChartOption;

	}]);
