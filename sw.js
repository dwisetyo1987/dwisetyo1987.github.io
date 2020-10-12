importScripts('/pusher.worker.min.js');

Pusher.logToConsole = true;

let pusher = new Pusher('7c0c7a4697e657e7a1c0', {
	cluster: 'ap1'
});

let channel = pusher.subscribe('my-channel');

channel.bind('my-event', function(data) {
	self.registration.showNotification(data.title, {
		icon: icon.jpg,
		image: data.image,
		body: data.message
	});
});
