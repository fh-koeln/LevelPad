'use strict';

exports.index = function(req, res) {
	console.log('hallo chat index');
	res.json({ yes: 'we can' });
};

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
