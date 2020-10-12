importScripts("/pusher.worker.js");

Pusher.setLogger(function(log){
  console.log(log)
});

var pusher = new Pusher('7c0c7a4697e657e7a1c0', {
  encrypted: true,
  disableStats: true
});

var channel = pusher.subscribe('my-channel');

channel.bind('my-event', function(data) {
  self.registration.showNotification(data.title, {
    icon: 'https://avatars3.githubusercontent.com/u/739550?v=3&s=200',
    body: data.message
  });
});
