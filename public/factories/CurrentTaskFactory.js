
angular.module('levelPad').provider('CurrentTask', function() {
	this.$get = ['$routeParams', '$q', 'Task', function($routeParams, $q, Task) {
		if (!$routeParams.module) {
			return $q.reject('Route parameter module is not defined to get current task.');
		} else if (!$routeParams.subject) {
			return $q.reject('Route parameter subject is not defined to get current task.');
		} else if (!$routeParams.task) {
			return $q.reject('Route parameter task is not defined to get current task.');
		} else {
			return Task.get({
				module: $routeParams.module,
				subject: $routeParams.subject,
				task: $routeParams.task
			});
		}
	}];
});
