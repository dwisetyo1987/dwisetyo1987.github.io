const publicVapidKey = 'BAzIPriM8r4zOsTCld9_b2Tpi_Zd5jxWwPIxHuC8Dd6p12K08Lp4--eytQkOcgoJmGYB64aSgOQs97-HgF3YCfE';

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/push-notif/worker.js", {
    scope: "/push-notif/"
  });
  console.log("Service Worker Registered...");
  
  const activated = new Promise((res, rej) => {
      setTimeout(() => {
          res(true)
      }, 2000)
  })
  const activate = await activated
  console.log("Service Worker Activated...")

  // Register Push
  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  await fetch("https://goldenrod-flint-thimbleberry.glitch.me/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });
  console.log("Push Sent...");
}

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
}
