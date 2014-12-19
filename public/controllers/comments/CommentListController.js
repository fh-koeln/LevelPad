/* global angular, alert */

angular.module('levelPad').controller('CommentListController', [
	'$scope', '$stateParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'Task', 'Comment', 'CurrentModule', 'CurrentSubject',
	function ($scope, $stateParams, $location, $log, DialogService, Module, Subject, Member, Task, Comment, CurrentModule, CurrentSubject) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		$scope.comment = new Comment();
		$scope.showComments = 0;

		$scope.update = function () {
			if ($stateParams.member) {
				$scope.member = Member.get({
					module: $stateParams.module,
					subject: $stateParams.subject,
					member: $stateParams.member
				});
			}
			var taskId = $stateParams.task || $scope.taskId;
			if (taskId) {
				$scope.task = Task.get({
					module: $stateParams.module,
					subject: $stateParams.subject,
					task: taskId
				}, function(){
						if ($stateParams.member) {
							Comment.query({
								module: $stateParams.module,
								subject: $stateParams.subject,
								member: $stateParams.member
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
				module: $stateParams.module,
				subject: $stateParams.subject,
				member: $stateParams.member
			});
		};

		$scope.saveComment = function(){
			$scope._saveComment();
		};
}]);
