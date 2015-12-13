var io  = require('socket.io')(8000);

io.on('connection', function(socket) {
	socket.on("new-client", function(data) {
		socket.emit("new-client", {"message" : "Hello "+data.name});
		socket.broadcast.emit("new-client", {"message" : data.name+" has joined us"});
	});

	socket.on("chat-message", function(data) {
		console.log(data);
		socket.broadcast.emit("new-message", {"name" : data.name, "message" : data.message });
	});
});