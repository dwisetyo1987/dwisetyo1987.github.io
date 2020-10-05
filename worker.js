let dataUrl = ""
self.addEventListener("push", event => {
    const data = event.data.json()
    console.log("Push Recieved...")
    const options = {
        icon: data.icon,
        image: data.image,
        body: data.body
    }
    dataUrl = data.url
    const notificationPromise = self.registration.showNotification(data.title, options)
    event.waitUntil(notificationPromise)
})

self.addEventListener('notificationclick', event => {
    event.notification.close()
    event.waitUntil(clients.openWindow(dataUrl))
})