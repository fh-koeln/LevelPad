
angular.module('levelPad').factory('CurrentModule', ['$routeParams', 'Module', function($routeParams, Module) {
	return Module.get({
		module: $routeParams.module
	});
}]);
