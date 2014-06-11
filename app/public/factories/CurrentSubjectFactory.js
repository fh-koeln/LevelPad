
angular.module('levelPad').factory('CurrentSubject', ['$routeParams', 'Subject', function($routeParams, Subject) {
	if ($routeParams.module && $routeParams.subject) {
		return Subject.get({
			module: $routeParams.module,
			subject: $routeParams.subject
		});
	}
}]);
