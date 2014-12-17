/* global angular, alert */

angular.module('levelPad').controller('MemberListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Member', 'DialogService', 'CurrentModule', 'ChartOption', 'Grade',
	function ($scope, $routeParams, $location, $log, Module, Subject, Member, DialogService, CurrentModule, ChartOption, Grade) {

		'use strict';

		$scope.module = CurrentModule;

		$scope.update = function() {
			$scope.subject = Subject.get({
				module: $routeParams.module, 
				subject: $routeParams.subject
			}, function(){
				// Get all member for the current module and subject.
				$scope.members = Member.query({ 
					module: $routeParams.module, 
					subject: $routeParams.subject 
				}, function (members) {
					angular.forEach(members, function(member){
						Grade.prepareMemberList($scope, member);
					});

				}, function() {
					alert('Could not load members.');
				});	
			}, function(){
				alert('Could not load subjects.');
			});
		};
		$scope.update();

		//Pie Chart Magic
		$scope.options = ChartOption;

	}]);
