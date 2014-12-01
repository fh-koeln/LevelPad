
angular.module('levelPad').factory('CurrentModule', ['$routeParams', '$q', 'Module', function($routeParams, $q, Module) {
	if (!$routeParams.module) {
		return $q.reject('Route parameter module is not defined to get current module.');
	} else {
		return Module.get({
			module: $routeParams.module
		});
	}
}]);
