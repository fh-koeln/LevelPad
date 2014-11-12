
angular.module('levelPad').factory('CurrentTask', ['$routeParams', 'Task', function($routeParams, Task) {
	if ($routeParams.module && $routeParams.subject && $routeParams.task) {
		return Task.get({
			module: $routeParams.module,
			subject: $routeParams.subject,
            task: $routeParams.task
		});
	}
}]);
