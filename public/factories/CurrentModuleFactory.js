
angular.module('levelPad').provider('CurrentModule', function() {
	this.$get = ['$stateParams', '$q', 'Module', function($stateParams, $q, Module) {
		if (!$stateParams.module) {
			return $q.reject('Route parameter module is not defined to get current module.');
		} else {
			return Module.get({
				module: $stateParams.module
			});
		}
	}];
});
