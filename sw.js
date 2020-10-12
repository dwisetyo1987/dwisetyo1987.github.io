importScripts('/pusher.worker.min.js');

var pusher = new Pusher('7c0c7a4697e657e7a1c0', {
  cluster: 'ap1',
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
