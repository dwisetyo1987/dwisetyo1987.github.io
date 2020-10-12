require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_APP_KEY,
	secret: process.env.PUSHER_APP_SECRET,
	cluster: process.env.PUSHER_APP_CLUSTER,
	useTLS: true
});

pusher.trigger('my-channel', 'my-event', {
  'title': 'Realtime Notification',
  'image': 'https://i.ytimg.com/vi/uHKfrz65KSU/maxresdefault.jpg',
	'message': 'by dwisetyo1987@gmail.com'
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
