const grantPermission = () => {
  if (!('Notification' in window)) {
    alert('This browser does not support system notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('You are already subscribed to web notifications');
    return;
  }

  if (
    Notification.permission !== 'denied' ||
    Notification.permission === 'default'
  ) {
    Notification.requestPermission().then(result => {
      if (result === 'granted') {
        const notification = new Notification(
          'Awesome! You will start receiving notifications shortly'
        );
      }
    });
  }
};

const showNotification = data => {
  const title = `${data.message}`;
  new Notification(title);
};

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher('7c0c7a4697e657e7a1c0', {
  cluster: 'ap1'
});

const channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
  showNotification(data);
});

const subscribe = document.getElementById('subscribe');
subscribe.addEventListener('click', event => {
  grantPermission();
  subscribe.parentNode.removeChild(subscribe);
});
