const publicVapidKey = 'BJ-nbtJ-FYKr_MR2acocIByfAs8RlrGG9bzzSQM_RA1p8aqTTNpiUK81EiNkR4y7QRYwoPUT4NJZa_CJ5OzSGG0';

let url = 'wss://lavender-luck-smelt.glitch.me/ws'
let socket = new WebSocket(url);

navigator.serviceWorker.register('sw.js').then(function(reg){
  if(reg.installing) {
    console.log('Service worker installing');
    setTimeout(() => {
      location.reload()
    }, 500)
  } else if(reg.active) {
    console.log('Service worker active');
  }

  if (!(reg.showNotification)) {
    throw('Notifications aren\'t supported on service workers.');
    return;
  }

  if (Notification.permission === 'denied') {
    throw('The user has blocked notifications.');
  }
});

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    document.querySelector("#subscribeButton").addEventListener('click', event => {
      document.querySelector("#subscribeButton").textContent = "Subscribed";
      Notification.requestPermission();
    });
    
    document.querySelector("#sendButton").addEventListener('click', event => {
      sendMessage();
    });
    
    if (Notification.permission === 'granted') {
      document.querySelector("#subscribeButton").textContent = "Subscribed";
    };
  }
});

function sendMessage() {
  changeButtonColor()
  .then(sendSocketMessage)
  .then(clearMessage)
  
  function changeButtonColor() {
    return new Promise((res) => {
      document.querySelector("#sendButton").className = "btn btn-light btn-lg btn-block";
      res(true)
    })
  }
	
  function sendSocketMessage(val) {
    if (val === true) {
      return new Promise((res) => {
        setTimeout(() => {
          const message = {
            title: document.querySelector("#title").value,
            image: document.querySelector("#image").value,
            body: document.querySelector("#body").value
          }
          document.querySelector("#sendButton").className = "btn btn-primary btn-lg btn-block";
          socket.send(JSON.stringify({ message }));
          res(true)
        }, 200)
      })
    }
  }
  
  function clearMessage(val) {
    if (val === true) {
      return new Promise((res) => {
        setTimeout(() => {
          document.querySelector("#title").value = ""
          document.querySelector("#image").value = ""
          document.querySelector("#body").value = ""
          res(true)
        }, 200)
      })
    }
  }
}

// handle incoming messages
socket.onmessage = function(e) {
  let res = JSON.parse(e.data)
  sendPush(res)
    
  async function sendPush(data) {
    let message = {
      title: data.message.title,
      image: data.message.image,
      body: data.message.body
    };
    
    const register = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    await fetch("https://lavender-luck-smelt.glitch.me/push", {
      method: "POST",
      body: JSON.stringify({ subscription, message }),
      headers: {
        "content-type": "application/json"
      }
    })    
  }
  
};

socket.onclose = function(e) {
  notifCode()
  .then(reloadPage)
  
  function notifCode() {
    return new Promise((res) => {
      let resCode = e.code
      console.log(`Closed: ${resCode}`);
      res(true)
    })
  }
  
  function reloadPage(val) {
    if (val === true) {
      return new Promise((res) => {
        setTimeout(() => {
          location.reload()
        }, 500)
      })
    }
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
