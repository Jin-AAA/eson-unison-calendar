/* ESON × UNISON Calendar Firebase Messaging Service Worker
   v13: use Firebase 8 classic service worker SDK for broader compatibility on GitHub Pages. */

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB-zKGQ4NNNnRh-BMep97o66iSR7juKVoY',
  authDomain: 'eson-unison-calendar-cd2f9.firebaseapp.com',
  projectId: 'eson-unison-calendar-cd2f9',
  storageBucket: 'eson-unison-calendar-cd2f9.firebasestorage.app',
  messagingSenderId: '672800291334',
  appId: '1:672800291334:web:818338c46b659531bfe187',
  measurementId: 'G-XDER4CP7WP'
});

try {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload && payload.notification && payload.notification.title
      ? payload.notification.title
      : 'ESON × UNISON Calendar';
    const notificationOptions = {
      body: payload && payload.notification && payload.notification.body ? payload.notification.body : '',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      data: payload && payload.data ? payload.data : {}
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {
  console.error('[SW] Firebase Messaging init failed:', error);
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification && event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : './';
  event.waitUntil(clients.openWindow(targetUrl));
});
