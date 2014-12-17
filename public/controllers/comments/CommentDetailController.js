/* global angular, alert */

angular.module('levelPad').controller('CommentDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'Comment', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Member, Comment, CurrentModule, CurrentSubject) {

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
							$scope.comments = Comment.query({
								module: $routeParams.module,
								subject: $routeParams.subject,
								member: $routeParams.member
							},function(){
								var comment = objectFindByKey($scope.comments, 'comment', $scope.task._id);
								if (evaluation){
									$scope.comment = comment;

								}
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