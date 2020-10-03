let openUrl = ""
self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  const options = {
	  body: data.body,
	  icon: data.icon
  }
  openUrl = data.url;
  const notificationPromise = self.registration.showNotification(data.title, options);
  e.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', e => {
	const data = e.data.json();
	e.notification.close();
	e.waitUntil(
		clients.openWindow(openUrl)
	);
});