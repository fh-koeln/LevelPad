/* global angular, alert */

angular.module('levelPad').controller('MemberDetailController', [
	'$scope', '$stateParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'CurrentModule', 'CurrentSubject', 'CurrentMember', 'ChartOption', 'Grade',
	function ($scope, $stateParams, $location, $log, DialogService, Module, Subject, Member, CurrentModule, CurrentSubject, CurrentMember, ChartOption, Grade) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;

		$scope.update = function() {
			if ($stateParams.member) {
				$scope.member = Member.get({
					module: $stateParams.module,
					subject: $stateParams.subject,
					member: $stateParams.member
				}, function () {
					Grade.prepareMember($scope);
				}
			)}
		};

		$scope.update();

		//Pie Chart Magic
		$scope.options = ChartOption;

	}]);
