/* global io */

angular.module('levelPad').controller('ChatController', function ($scope, $http) {
	'use strict';

	$http.get('/chat').success(function(json) {
		$scope.json = json;
	});

	$scope.messages = [];
	$scope.connected = false;

	// Maybe we should reconfigure the defaults for heroku later???
	// From https://devcenter.heroku.com/articles/realtime-polyglot-app-node-ruby-mongodb-socketio#pushing-messages-to-the-browser-with-socket-io
//	io.configure(function () {
//		io.set("transports", ["xhr-polling"]);
//		io.set("polling duration", 10);
//	});

	var socket = io.connect();

	socket.on('connect', function() {
		console.log('connected');
		$scope.connected = true;
		$scope.$apply();
	});

	socket.on('disconnect', function() {
		console.log('disconnected');
		$scope.connected = false;
		$scope.$apply();
	});

	$scope.sendMessage = function() {
		if ($scope.text) {
			console.log('send message: ' + $scope.text);
			socket.emit('chat_message', {
				type: 'message',
				text: $scope.text
			});
		}
	};

	socket.on('chat_message', function(data) {
		$scope.messages.push(data.text);
		$scope.$apply();
	});

});
