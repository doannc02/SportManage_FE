// public/firebase-messaging-sw.js

// Import the 'compat' versions of Firebase SDKs using importScripts
// These are necessary for Service Workers to load Firebase libraries directly.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
// This configuration should match the one in your React app's usePushNotifications.js
const firebaseConfig = {
    apiKey: "AIzaSyAuFJebJP-M986h-lPgvImewYRJ4HI6diQ",
    authDomain: "push-notifications-2d078.firebaseapp.com",
    projectId: "push-notifications-2d078",
    storageBucket: "push-notifications-2d078.firebasestorage.app",
    messagingSenderId: "577231585474",
    appId: "1:577231585474:web:6ab941d74dc6c6dccefb5b",
    // measurementId is not needed for Service Worker and can be omitted
    // measurementId: "G-P89F12HJD6"
};

// Initialize Firebase App in the Service Worker context
// Access functions directly from the global 'firebase' object provided by importScripts
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(); // Correctly initialize messaging object

// --- Background Message Handling ---
// Lắng nghe tin nhắn từ Firebase khi ứng dụng đang ở background/closed
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body,
        icon: payload.notification?.icon || '/icon-192x192.png', // Đảm bảo bạn có icon này trong thư mục public/
        data: payload.data, // Dữ liệu tùy chỉnh từ backend
        actions: [ // Ví dụ thêm action buttons (tùy chọn)
            { action: 'open_order', title: 'Xem đơn hàng' },
            { action: 'dismiss', title: 'Bỏ qua' }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- Notification Click Handling ---
// Lắng nghe sự kiện click vào thông báo
self.addEventListener('notificationclick', (event) => {
    const clickedNotification = event.notification;
    const action = event.action;

    console.log('[Service Worker] Notification click received:', clickedNotification, 'Action:', action);

    clickedNotification.close(); // Đóng thông báo

    if (action === 'open_order' && clickedNotification.data && clickedNotification.data.orderId) {
        const orderId = clickedNotification.data.orderId;
        const targetUrl = `/orders/${orderId}`; // Đường dẫn trang chi tiết đơn hàng của bạn

        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    for (const client of clientList) {
                        if (client.url.includes(targetUrl) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    return clients.openWindow(targetUrl); // Mở tab mới nếu chưa có
                })
        );
    } else if (action === 'dismiss') {
        // Không làm gì thêm, chỉ đóng thông báo
    } else {
        // Xử lý click mặc định (ví dụ: mở trang chính của ứng dụng)
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Bạn có thể thêm các sự kiện Service Worker khác như 'install', 'activate', 'fetch' nếu cần.