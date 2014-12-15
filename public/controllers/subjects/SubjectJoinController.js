/* global alert */

angular.module('levelPad').controller('SubjectJoinController', [
	'$scope', 'Member', 'AuthService',
	function ($scope, Member, AuthService) {

		'use strict';

		$scope.update = function() {
			$scope.member = new Member();
			$scope.member.id = AuthService.user._id;
			$scope.member.role = 'member';
		};

		$scope.update();


		$scope._save = function() {

			return $scope.member.$save({
				subject: $scope.subject.slug,
				module: $scope.subject.module.slug
			});
		};

}]);
