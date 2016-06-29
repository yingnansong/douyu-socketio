# douyu-bridge-socket.io
Local Socket.IO relay server for DouyuTV comments.

## Install
npm install douyu-socketio

## Supported platforms
This library has been tested with:

- IO.js v2.5.0

## Example Usage

1. Create relay server script as index.js

	var DouyuSocketIO = require('douyu-socketio');

	new DouyuSocketIO(
		"431972", // Room ID
		8000, // HTTP Port
		null, // Web Requests Handler
		[ // Names of events that will be dispatched to audiences
			'chatmsg', // Chat message
			'dgb', // Gift notices
			'uenter', // User enter
			'ranklist', // Rank list
			'spbc' // In-room gift notices
		]
	).start();

2. Run relay servet script

	node index.js

3. Create an HTML file and put it on local web server

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>DouyuTV SocketIO Relay Server Test</title>
	</head>
	<body>
	<h1>DouyuTV SocketIO Relay Server Test</h1>
	<ul id="chats">

	</ul>

	<script src="http://localhost:8000/socket.io/socket.io.js"></script>
	<script>

	io('http://localhost:8000').on('message', function(msg){
	  	
		if(!msg) {
			return;
		}

		console.log(msg);

		switch(msg.type) {
			case 'chatmsg': {
				// Chat message
				var text = '[' + msg.nn + ' Lv.' + msg.level + '] ' + msg.txt;
				var node = document.createElement("LI");
				var textnode = document.createTextNode(text);
				node.appendChild(textnode);
				document.getElementById('chats').appendChild(node);
				break;
			}
		}

	});

	</script>
	</body>
	</html>

4. Visit this web page