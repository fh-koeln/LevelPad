
angular.module('levelPad').provider('CurrentMember', function() {
	this.$get = ['$stateParams', '$q', 'Member', function($stateParams, $q, Member) {
		if (!$stateParams.module) {
			return $q.reject('Route parameter module is not defined to get current member.');
		} else if (!$stateParams.subject) {
			return $q.reject('Route parameter subject is not defined to get current member.');
		} else if (!$stateParams.member) {
			return $q.reject('Route parameter task is not defined to get current member.');
		} else {
			return Member.get({
				module: $stateParams.module,
				subject: $stateParams.subject,
				member: $stateParams.member
			});
		}
	}];
});

