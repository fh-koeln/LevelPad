'use strict';

var messages = [];

exports.receiveMessageIO = function(io, socket, data) {
	console.log('Receive:', data);
	
	socket.emit('chat_message', {
		type: 'message',
		text: data.text
	});
	socket.broadcast.emit('chat_message', {
		type: 'message',
		text: data.text
	});
};
