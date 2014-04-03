var http = require('http');
var port = Number(process.env.PORT || 5000);
var userCount = 0;
http.createServer(function (request, response) {
	console.log('New connection');
	userCount++;

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('Hello!\n');
	response.write('We have had '+userCount+' visits!\n');
	response.end();
}).listen(port);

console.log('Server started');
