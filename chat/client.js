$(document).ready(function() {
	var socket;
	$('#connect').on("click", function(e) {
		console.log("Connecting");
	 	socket = io('http://localhost:8000');
		socket.on("connect", function() {
			socket.emit("new-client", { "name": $('#name').val() });
		});

		socket.on("new-client", function(data) {
			$('#conversation').append("<p class='new-connection'>"+data.message+"</p>");
		});

		socket.on("new-message", function(data) {
			$('#conversation').append("<p class='chat'><span class='name'>"+data.name+": "+data.message+"</p>");
		});

	});

	$('#chat').on("click", function(e) {
		socket.emit("chat-message", { "name" : $('#name').val(), "message" : $('textarea').val()});
		$('#conversation').append("<p class='chat'><span class='name'>You: "+$('textarea').val()+"</p>");
		$('textarea').val("");
	});
});