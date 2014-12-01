
angular.module('levelPad').factory('CurrentSubject', ['$routeParams', '$q', 'Subject', function($routeParams, $q, Subject) {
	if (!$routeParams.module) {
		return $q.reject('Route parameter module is not defined to get current subject.');
	} else if (!$routeParams.subject) {
		return $q.reject('Route parameter subject is not defined to get current subject.');
	} else {
		return Subject.get({
			module: $routeParams.module,
			subject: $routeParams.subject
		});
	}
}]);
