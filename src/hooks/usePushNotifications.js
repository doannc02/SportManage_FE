// src/hooks/usePushNotifications.js
import {  initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { authApi } from "../configs/auth";
import { getAppTokenFcmServiceWorker, setAppTokenFcmServiceWorker } from "../configs/token";
import { VITE_API_KEY_FIREBASE, VITE_APP_ID, VITE_AUTH_DOMAIN, VITE_MESSAGING_SENDER_ID, VITE_PROJECT_ID, VITE_STORAGE_BUCKET } from "../configs/env";

// CẤU HÌNH FIREBASE CỦA BẠN (Lấy từ Firebase Console > Project settings > Your apps > Web app)
const firebaseConfig = {
  apiKey: VITE_API_KEY_FIREBASE,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
  // measurementId is not needed for Service Worker and can be omitted
  // measurementId: "G-P89F12HJD6"
};

// Khởi tạo Firebase App (chỉ một lần)
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


const usePushNotifications = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [lastMessage, setLastMessage] = useState(null);

  console.log("Firebase App initialized:", fcmToken, notificationPermission,Notification, lastMessage);

  useEffect(() => {
    // Đăng ký Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Lắng nghe tin nhắn khi ứng dụng đang ở foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      setLastMessage(payload); // Cập nhật state để hiển thị trên UI

      // Tùy chỉnh hiển thị thông báo khi ở foreground (nếu muốn)
      const notificationTitle =
        payload.notification?.title || "New Notification";
      const notificationOptions = {
        body: payload.notification?.body,
        icon: payload.notification?.icon || "/icon-192x192.png",
        data: payload.data,
      };
      new Notification(notificationTitle, notificationOptions);
    });

    // Cleanup function cho useEffect
    return () => {
      unsubscribe(); // Hủy đăng ký listener khi component unmount
    };
  }, []);

  // Hàm yêu cầu quyền và lấy token
  const requestForToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        console.log("Notification permission granted.");
        const currentToken = await getToken(messaging, {
          vapidKey:
            "BC9n4TpI-crMClddL4P4oH0jl5Xw5IoVM6zgsU2VqDikf-klATnA-udPfKAiqf3iKuYDirqw-yAqrdZW8FSECE8",
        });
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setFcmToken(currentToken);
          setAppTokenFcmServiceWorker(currentToken); 
          sendTokenToServer(currentToken);
        } else {
          console.log(
            "No FCM registration token available. Request permission to generate one."
          );
        }
      } else {
        console.warn("Unable to get permission to notify.");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  const sendTokenToServer = async (token) => {
    try {
      if (!token) {
        token = getAppTokenFcmServiceWorker()
        return;
      }
      const response = await authApi( {
        url: "/api/users/save-fcm-token", 
        method: "POST",
        data: JSON.stringify({ fcmToken: token }),
      });

      if (!response) {
        throw new Error("Failed to save FCM token on server.");
      }
      console.log("FCM Token sent to server successfully.");
    } catch (error) {
      console.error("Error sending FCM token to server:", error);
    }
  };

  return { fcmToken, notificationPermission, lastMessage, requestForToken };
};

export default usePushNotifications;


