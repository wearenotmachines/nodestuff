var http = require('http');
var WebSocketServer = require('websocket').server;

var plainServer = http.createServer(function(request, response) {
	console.log("Request received from "+request.url);
	response.writeHead(404);
	response.end();

});

plainServer.listen(9000, function() {
	console.log((new Date()) + " Server starts");
});

var ws = new WebSocketServer({
	httpServer : plainServer
});

var connections = [];

ws.on('connect', function(wsConnection) {
	console.log("New connection received.");
	connections.push({
		"connection" : wsConnection
	});
		console.log(connections.length);
	
});

ws.on('request', function(request) {

	var connection = request.accept('echo-protocol', request.origin);

	connection.on('message', function(m) {
		console.log(connections.length);
		var output = execute(m.utf8Data, connection);

	});

	connection.on('close', function(code, desc) {
		console.log((new Date())+": "+connection.remoteAddress+" has disconnected");
	})

});

function findConnection(connection) {
	for (var c in connections) {
		if (connections[c].connection = connection) {
			return connections[c];
		}
	}
	return;
}

var wsFunction = {
	setup : function(data, connection) {
		var conn = findConnection(connection);
		conn.name = data.name;
		return respond({
			"message" : "Hi there, "+data.name,
			"state" : "talking"
		}, connection);
	},

	talking : function(data, connection) {
		var conn = findConnection(connection);
		return respond({
			"message" : conn.name+" said: "+data.message,
			"state" : "talking"
		});
	}
}

function respond(output, toAll) {

	if (toAll===true || undefined===toAll) {
		for (var c in connections) {
			connections[c].connection.sendUTF(JSON.stringify(output));
		}
	} else {
		toAll.sendUTF(JSON.stringify(output));
	}
	return ;
}

function execute(rawData, connection) {
	var parsed = JSON.parse(rawData);
	var action = parsed.action;
	return wsFunction[action](parsed.data, connection);
}

