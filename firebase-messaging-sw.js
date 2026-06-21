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
    const data = payload.data || {};
    const title = String(data.title || 'ESON × UNISON Calendar');
    const body = String(data.body || '推播測試成功 🎉');

    const options = {
      body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: data.tag || 'eson-unison-calendar',
      renotify: true,
      requireInteraction: false,
      timestamp: Date.now(),
      data: {
        url: data.url || './'
      }
    };

    self.registration.showNotification(title, options);
  });
} catch (error) {
  console.error('[SW] Firebase Messaging init failed:', error);
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || './';
  event.waitUntil(clients.openWindow(targetUrl));
});