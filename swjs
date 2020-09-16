function send() {
  const title = 'Push Codelab';
  const options = {
    body: 'NEVER GONNA GIVE YOU UP.',
    icon: 'memepage/favicon.ico',
    badge: 'memepage/favicon.ico'
  };

  event.waitUntil(self.registration.showNotification(title, options));
}


self.addEventListener('push', send());
self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  event.waitUntil(
    send();
  );
});
