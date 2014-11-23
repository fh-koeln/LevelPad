
angular.module('levelPad').factory('CurrentTask', ['$routeParams', 'Task', function($routeParams, Task) {
	return Task.get({
		module: $routeParams.module,
		subject: $routeParams.subject,
		task: $routeParams.task
	});
}]);
