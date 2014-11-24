
angular.module('levelPad').factory('CurrentMember', ['$routeParams', 'Member', function($routeParams, Member) {
	return Member.get({
		module: $routeParams.module,
		subject: $routeParams.subject,
		task: $routeParams.task,
		member: $routeParams.member
	});
}]);
