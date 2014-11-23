
angular.module('levelPad').factory('CurrentSubject', ['$routeParams', 'Subject', function($routeParams, Subject) {
	return Subject.get({
		module: $routeParams.module,
		subject: $routeParams.subject
	});
}]);
