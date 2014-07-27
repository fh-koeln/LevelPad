
module.exports = function(urlPrefix, router) {
	var extractUrl = function(route) {

		// Extract router path
		if (route.route && route.route.path) {
//			return route.route.path;
		}

		// Convert regex to string
		var url = route.regexp.toString();

		// Remove regex prefix "/^" and optional slash suffx "\/?$/i" or "\/?(?=/|$)/i"
		if (url.indexOf('/^') === 0) {
			url = url.substring(2);
		}
		if (url.lastIndexOf('\\/?$/i') === url.length - 6) {
			url = url.substring(0, url.length - 6);
		}
		if (url.lastIndexOf('\\/?(?=/|$)/i') === url.length - 12) {
			url = url.substring(0, url.length - 12);
		}

		// Simplify "\/?$" and "\/"
		url = url.replace(/\\\/?$/g, '').replace(/\\\//g, '/');

		if (route.keys) {
			for (var index in route.keys) {
				if (index == (route.keys.length - 1)) {
					url = url.replace(/\(\?\:(.*?)\)$/, ':' + route.keys[index].name);
				} else {
					url = url.replace(/\(\?\:(.*?)\)\//, ':' + route.keys[index].name + '/');
				}
			}
		}

		// Extract router path
		if (route.route && route.route.path && route.route.path != url) {
			console.log('ORINGAL ROUTE ' + route.route.path + ' vs CALCULATED ROUTE ' + url)
		}

		return url;
	};

	var getValues = function(originalRoutes) {
		var routes = [];
		for (var index in originalRoutes) {
			routes.push(originalRoutes[index]);
		}
		return routes;
	};

	var extractRoutes = function(urlPrefix, router, routes) {
		routes = routes || {};

		for (var index in router.stack) {
			var route = router.stack[index];
			var url = urlPrefix + extractUrl(route);

			// Handle sub-router
			if (route.handle && route.handle.stack) {
				extractRoutes(url, route.handle, routes);
				continue;
			}

			// Resource handler
			if (route.route && route.route.methods && route.route.path) {
				if (!routes[url]) {
					routes[url] = { url: url, methods: [] };
				}
				for (var method in route.route.methods) {
					if (routes[url].methods.indexOf(method.toUpperCase()) === -1 && route.route.methods[method]) {
						routes[url].methods.push(method.toUpperCase());
					}
				}
				continue;
			}

			console.log('ELSE');
			console.log(route);
		}

		return getValues(routes);
	};

	return function(req, res) {
		res.json(200, extractRoutes(urlPrefix, router));
	};
};
