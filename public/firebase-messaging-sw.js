// firebase-messaging-sw.js
// Đây là Service Worker của Firebase Cloud Messaging

// Import scripts (quan trọng: sử dụng đường dẫn CDN của Firebase)
// Thay đổi phiên bản Firebase nếu bạn đang dùng phiên bản khác
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Cấu hình Firebase App bên trong Service Worker
// Sử dụng cùng một cấu hình với ứng dụng client của bạn
const firebaseConfig = {
    apiKey: "AIzaSyAuFJebJP-M986h-lPgvImewYRJ4HI6diQ",
    authDomain: "push-notifications-2d078.firebaseapp.com",
    projectId: "push-notifications-2d078",
    storageBucket: "push-notifications-2d078.firebasestorage.app",
    messagingSenderId: "577231585474",
    appId: "1:577231585474:web:6ab941d74dc6c6dccefb5b",
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Lấy đối tượng Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Tùy chỉnh thông báo hiển thị cho người dùng
    const notificationTitle = payload.notification.title || 'New Background Message';
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/icon-192x192.png', 
        data: payload.data 
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bạn cũng có thể thêm các listener khác cho Service Worker tại đây, ví dụ:
// self.addEventListener('install', (event) => {
//     console.log('Service Worker installed!');
// });

// self.addEventListener('activate', (event) => {
//     console.log('Service Worker activated!');
// });

// self.addEventListener('fetch', (event) => {
//     // Điều này không bắt buộc cho Firebase Messaging nhưng có thể dùng để cache tài nguyên
// });

// Bắt sự kiện người dùng nhấp vào thông báo
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Đóng thông báo sau khi nhấp

    // Mở một cửa sổ mới hoặc chuyển đến tab hiện có
    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((clientList) => {
        if (clientList.length > 0) {
            let client = clientList[0];
            for (let i = 0; i < clientList.length; i++) {
                if (clientList[i].url.includes(event.notification.data.urlToOpen)) { 
                    client = clientList[i];
                    break;
                }
            }
            return client.focus();
        } else {
            // Mở một tab mới nếu không có tab nào đang mở
            return clients.openWindow(event.notification.data.urlToOpen || '/');
        }
    }));
});
