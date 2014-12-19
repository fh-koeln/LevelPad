
angular.module('levelPad').provider('CurrentSubject', function() {
	this.$get = ['$stateParams', '$q', 'Subject', function($stateParams, $q, Subject) {
		if (!$stateParams.module) {
			return $q.reject('Route parameter module is not defined to get current subject.');
		} else if (!$stateParams.subject) {
			return $q.reject('Route parameter subject is not defined to get current subject.');
		} else {
			return Subject.get({
				module: $stateParams.module,
				subject: $stateParams.subject
			});
		}
	}];
});
