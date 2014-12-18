
angular.module('levelPad').provider('CurrentTask', function() {
	this.$get = ['$stateParams', '$q', 'Task', function($stateParams, $q, Task) {
		if (!$stateParams.module) {
			return $q.reject('Route parameter module is not defined to get current task.');
		} else if (!$stateParams.subject) {
			return $q.reject('Route parameter subject is not defined to get current task.');
		} else if (!$stateParams.task) {
			return $q.reject('Route parameter task is not defined to get current task.');
		} else {
			return Task.get({
				module: $stateParams.module,
				subject: $stateParams.subject,
				task: $stateParams.task
			});
		}
	}];
});
