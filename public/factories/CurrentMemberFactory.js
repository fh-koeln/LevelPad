
angular.module('levelPad').provider('CurrentMember', function() {
	this.$get = ['$routeParams', '$q', 'Member', function($routeParams, $q, Member) {
		if (!$routeParams.module) {
			return $q.reject('Route parameter module is not defined to get current member.');
		} else if (!$routeParams.subject) {
			return $q.reject('Route parameter subject is not defined to get current member.');
		} else if (!$routeParams.member) {
			return $q.reject('Route parameter task is not defined to get current member.');
		} else {
			return Member.get({
				module: $routeParams.module,
				subject: $routeParams.subject,
				member: $routeParams.member
			});
		}
	}];
});

