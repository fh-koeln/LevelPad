'use strict';

angular.module('levelPad').controller('ChatController', function ($scope, $http) {

	$scope.messages = [];
	$scope.connected = false;

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
		$scope.messages.push(data)
		$scope.$apply();
	});

});
