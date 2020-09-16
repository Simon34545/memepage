self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'nEvEr gonna givE you up';
  const options = {
    body: 'nEvEr gonna lEt you down',
    icon: 'memepage/download.jpg',
    badge: 'memepage/download.jpg'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  );
});
