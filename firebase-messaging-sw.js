importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB-zKGQ4NNNnRh-BMep97o66iSR7juKVoY',
  authDomain: 'eson-unison-calendar-cd2f9.firebaseapp.com',
  projectId: 'eson-unison-calendar-cd2f9',
  storageBucket: 'eson-unison-calendar-cd2f9.firebasestorage.app',
  messagingSenderId: '672800291334',
  appId: '1:672800291334:web:818338c46b659531bfe187',
  measurementId: 'G-XDER4CP7WP'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'ESON × UNISON Calendar';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    data: payload.data || {}
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(clients.openWindow(targetUrl));
});
