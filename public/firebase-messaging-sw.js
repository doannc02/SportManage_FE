// firebase-messaging-sw.js
// Đây là Service Worker của Firebase Cloud Messaging

import { VITE_API_KEY_FIREBASE, VITE_APP_ID, VITE_AUTH_DOMAIN, VITE_MESSAGING_SENDER_ID, VITE_PROJECT_ID, VITE_STORAGE_BUCKET } from "../src/configs/env";



importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');




const firebaseConfig = {
  apiKey: VITE_API_KEY_FIREBASE,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
};

// Khởi tạo Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('[firebase-messaging-sw.js] Firebase initialized successfully.');
} catch (error) {
    console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
}

// Lấy đối tượng Messaging
const messaging = firebase.messaging();

// Listener cho tin nhắn push nền
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    try {
        if (payload.notification) {
            const notificationTitle = payload.notification.title || 'Thông báo mới (Không có tiêu đề)';
            const notificationBody = payload.notification.body || 'Nội dung trống.';
            const notificationIcon = payload.notification.icon || '/icon-192x192.png';
            
            console.log(`[firebase-messaging-sw.js] Notification Title: ${notificationTitle}`);
            console.log(`[firebase-messaging-sw.js] Notification Body: ${notificationBody}`);
            console.log(`[firebase-messaging-sw.js] Notification Icon: ${notificationIcon}`);
            console.log(`[firebase-messaging-sw.js] Notification Data:`, payload.data);

            const notificationOptions = {
                body: notificationBody,
                icon: notificationIcon,
                data: payload.data // Truyền dữ liệu tùy chỉnh cho sự kiện click
            };

            // Hiển thị thông báo
            self.registration.showNotification(notificationTitle, notificationOptions)
                .then(() => {
                    console.log('[firebase-messaging-sw.js] Notification shown successfully.');
                })
                .catch(error => {
                    console.error('[firebase-messaging-sw.js] Error showing notification:', error);
                    if (error.name === 'TypeError') {
                        console.error('Possible cause: Icon path might be incorrect or missing.');
                    }
                });
        } else {
            console.warn('[firebase-messaging-sw.js] Received background message without "notification" object in payload. Data:', payload.data);

        }
    } catch (error) {
        console.error('[firebase-messaging-sw.js] Error processing background message payload:', error);
    }
});

// Listener cho sự kiện cài đặt Service Worker
self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] Service Worker installed!');
    self.skipWaiting(); // Kích hoạt Service Worker ngay lập tức
});

// Listener cho sự kiện kích hoạt Service Worker
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Service Worker activated!');
    event.waitUntil(self.clients.claim()); 
});

// Bắt sự kiện người dùng nhấp vào thông báo
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);
    event.notification.close(); // Đóng thông báo sau khi nhấp

    // Lấy URL cần mở từ dữ liệu của thông báo
    const urlToOpen = event.notification.data ? event.notification.data.urlToOpen : '/';
    console.log(`[firebase-messaging-sw.js] URL to open on click: ${urlToOpen}`);

    // Mở một cửa sổ mới hoặc chuyển đến tab hiện có
    event.waitUntil(self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((clientList) => {
        if (clientList.length > 0) {
            let client = clientList[0]; // Mặc định chọn client đầu tiên
            for (let i = 0; i < clientList.length; i++) {
                // Tìm client có URL khớp với urlToOpen hoặc là trang gốc
                if (clientList[i].url.includes(urlToOpen) || clientList[i].url.endsWith('/')) { 
                    client = clientList[i];
                    console.log(`[firebase-messaging-sw.js] Found existing client for URL: ${client.url}`);
                    break;
                }
            }
            return client.focus();
        } else {
            // Mở một tab mới nếu không có tab nào đang mở
            console.log('[firebase-messaging-sw.js] No existing client found, opening new window.');
            return self.clients.openWindow(urlToOpen);
        }
    }).catch(error => {
        console.error('[firebase-messaging-sw.js] Error handling notification click:', error);
    }));
});
