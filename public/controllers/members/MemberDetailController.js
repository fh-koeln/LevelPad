/* global angular, alert */

angular.module('levelPad').controller('MemberDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'CurrentModule', 'CurrentSubject', 'CurrentMember', 'ChartOption', 'Grade',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Member, CurrentModule, CurrentSubject, CurrentMember, ChartOption, Grade) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;

		$scope.update = function() {
			if ($routeParams.member) {
				$scope.member = Member.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member
				}, function () {
					Grade.prepareMember($scope);
				}
			)}
		};

		$scope.update();

		//Pie Chart Magic
		$scope.options = ChartOption;

	}]);
