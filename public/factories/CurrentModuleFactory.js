
angular.module('levelPad').factory('CurrentModule', ['$routeParams', 'Module', function($routeParams, Module) {
	if ($routeParams.module) {
		return Module.get({
			module: $routeParams.module
		});
	}
}]);