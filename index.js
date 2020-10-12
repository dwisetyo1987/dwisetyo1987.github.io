if (!('serviceWorker' in navigator)) {
  throw("Service workers are not supported");
}

navigator.serviceWorker.register('sw.js').then(function(reg){
  if(reg.installing) {
    console.log('Service worker installing');
  } else if(reg.waiting) {
    console.log('Service worker installed');
  } else if(reg.active) {
    console.log('Service worker active');
  }
});

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

const subscribe = document.getElementById('subscribe');
subscribe.addEventListener('click', event => {
  grantPermission();
  subscribe.parentNode.removeChild(subscribe);
});
