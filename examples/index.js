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