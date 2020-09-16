function send(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'NEVER GONNA GIVE YOU UP.',
    icon: 'memepage/favicon.ico',
    badge: 'memepage/favicon.ico'
  };

  event.waitUntil(self.registration.showNotification(title, options));
}


self.addEventListener('push', send(event);
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    send();
  );
});
