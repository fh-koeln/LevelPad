/* global angular, alert */

angular.module('levelPad').controller('CommentDetailController', [
	'$scope', '$stateParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'Comment', 'CurrentModule', 'CurrentSubject',
	function ($scope, $stateParams, $location, $log, DialogService, Module, Subject, Member, Comment, CurrentModule, CurrentSubject) {

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
							$scope.comments = Comment.query({
								module: $stateParams.module,
								subject: $stateParams.subject,
								member: $stateParams.member
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
				module: $stateParams.module,
				subject: $stateParams.subject,
				member: $stateParams.member
			});
		};

		$scope.saveComment = function(){
			$scope._saveComment();
		};
}]);
