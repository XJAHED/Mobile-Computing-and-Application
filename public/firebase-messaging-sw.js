// Import Firebase Cloud Messaging service worker scripts
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDWqZRmFsBHDeiRmoR0pJp_45WYmmq-N44",
  authDomain: "redrop-9cf17.firebaseapp.com",
  projectId: "redrop-9cf17",
  storageBucket: "redrop-9cf17.firebasestorage.app",
  messagingSenderId: "837095603186",
  appId: "1:837095603186:web:2d1f4cad8525c3c16f896b"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'New Urgent Blood Request';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo.png',
    badge: '/favicon.png',
    tag: `redrop-${Date.now()}`,
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/home')) {
          return client.focus();
        }
      }
      return clients.openWindow('/home');
    })
  );
});
