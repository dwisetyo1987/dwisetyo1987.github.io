let openUrl = ""
self.addEventListener("push", e => {
  const data = e.data.json();
  const options = {
	  icon: "icon.jpg",
	  image: data.image,
	  body: data.body
  }
  openUrl = data.url;
  const notificationPromise = self.registration.showNotification(data.title, options);
  e.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', e => {
	e.notification.close();
	e.waitUntil(
		clients.openWindow(openUrl)
	);
});
