var http = require('http');
var socketio = require('socket.io');
var douyu = require('douyu');

function defaultHttpHandler(req, res) {
	
	res.writeHead(200);
	res.end("It works!");

}

/*
* roomID, string, room number in Douyu platform
* httpPort, number, the port number that SocketIO server listens on
* httpHandler, function(req, res), handler for web requests
* events, array<string>, names of message types that will be dispatched to every audience
*/
function DouyuSocketIO(roomID, httpPort, httpHandler, events){
	
	this.app = null;

	this.httpPort = httpPort;

	this.sockets = [];

	this.roomID = roomID;
	this.room = null;

	this.events = events;

	if(httpHandler) {
		this.httpHandler = httpHandler;
	} else {
		this.httpHandler = defaultHttpHandler.bind(this);
	}

}

DouyuSocketIO.prototype.start = function(){
	
	var self = this;

	this.room = new douyu.ChatRoom(this.roomID);
	this.events.forEach(function(eventName){
		self.room.on(eventName, self.onRoomMessage.bind(self));
	});
	this.room.open();

	this.app = http.createServer(this.httpHandler);
	this.io = socketio(this.app);
	this.io.on('connection', this.onConnected.bind(this));
	this.app.listen(this.httpPort);

};

DouyuSocketIO.prototype.addSocket = function(s){
	this.sockets.push(s);
};

DouyuSocketIO.prototype.removeSocket = function(s){
	var idx = this.sockets.indexOf(s);
	if(idx < 0) {
		return;
	}

	this.sockets.splice(idx, 1);
};

DouyuSocketIO.prototype.onConnected = function(s){
	var self = this;

	this.addSocket(s);

	s.on('error', function(err) {
		console.error(err);
	});

	s.on('close', function(hasError) {
		self.removeSocket(s);
	});
};

DouyuSocketIO.prototype.onRoomMessage = function(message){
	var self = this;
	this.sockets.forEach(function(s){
		setTimeout(function(){
			self.sendMessage(s, message);
		}, 0);
	});
};

DouyuSocketIO.prototype.sendMessage = function(s, message){
	try {
		s.emit('message', message);
	} catch (e) {
		console.error('Error when broadcasting message from chat room: ', e);
	}
};


module.exports = DouyuSocketIO;

