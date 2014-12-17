/* global angular, alert */

angular.module('levelPad').controller('CommentListController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'Task', 'Comment', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Member, Task, Comment, CurrentModule, CurrentSubject) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		$scope.comment = new Comment();
		$scope.showComments = 0;
		
		$scope.update = function () {
			if ($routeParams.member) {
				$scope.member = Member.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member
				});
			}
			var taskId = $routeParams.task || $scope.taskId;
			if (taskId) {
				$scope.task = Task.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: taskId
				}, function(){
						if ($routeParams.member) {
							Comment.query({
								module: $routeParams.module,
								subject: $routeParams.subject,
								member: $routeParams.member
							}, function(comments) {
								$scope.comments = comments;
								console.log($scope.comments);
							});
							
						}
				});
			}
		};
		
		$scope.update();
		
		$scope._saveComment = function(){
			return $scope.comment.$save({
				module: $routeParams.module,
				subject: $routeParams.subject,
				member: $routeParams.member
			});
		};
		
		$scope.saveComment = function(){
			$scope._saveComment();
		};
}]);