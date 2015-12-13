var net = require('net');

var chatServer = net.createServer();

var clients = {};

function addClient(client) {
	clients[client.remotePort] = client;
	console.log("new client added "+client.remotePort);
}

function broadcast(what, who) {
	console.log(what.toString());
	for (c in clients) {
		if (clients[c]==who) continue;
		clients[c].write(what);
	}
}

function removeClient(who) {
	var leaver;
	for (var c in clients) {
		if (clients[c]==who) {
			leaver = c;
			delete clients[c];
			break;
		}
	}
	broadcast(leaver+" has left", who);
}

chatServer.on('connection', function(client) {

	addClient(client);

	client.on('data', function(data) {
		broadcast(data, client);
	});

	client.on('end', function() {
		removeClient(client);
	});

});

chatServer.listen(9000);
