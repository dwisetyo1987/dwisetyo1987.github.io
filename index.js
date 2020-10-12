document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'interactive') {
        if ("serviceWorker" in navigator) {
            installServiceWorker().catch(err => console.error(err))
        }
    }
})

async function installServiceWorker() {
    console.log("Registering service worker...")
    const register = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    })
    console.log("Service Worker Registered...")

    const activated = new Promise((res, rej) => {
        setTimeout(() => {
            res(true)
        }, 2000)
    })
    const activate = await activated
    console.log("Service Worker Activated...")
}

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
