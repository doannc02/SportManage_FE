// src/App.jsx
import  { useEffect } from 'react';
import AllRouter from './pages/AllRouter';
import usePushNotifications from './hooks/usePushNotifications'; // Đảm bảo đường dẫn đúng

function App() {
   
    const { fcmToken, notificationPermission, lastMessage, requestForToken } = usePushNotifications();

    useEffect(() => {
        if (notificationPermission !== 'granted') {
            requestForToken();
        }
    }, [notificationPermission, requestForToken]); 

    useEffect(() => {
        console.log("FCM Token in App:", fcmToken);
        console.log("Notification Permission in App:", notificationPermission);
        console.log("Last Message in App (Foreground):", lastMessage);
    }, [fcmToken, notificationPermission, lastMessage]);

    return (
        <>
            {/* AllRouter sẽ xử lý các routes của ứng dụng bạn */}
            <AllRouter />

            <div style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: 1000
            }}>
                <p>Trạng thái thông báo: <strong>{notificationPermission}</strong></p>
                {notificationPermission !== 'granted' && (
                    <button onClick={requestForToken} style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                        Bật thông báo
                    </button>
                )}
                {fcmToken && <p>Token: {fcmToken.substring(0, 10)}...</p>}
                {lastMessage && <p>Tin nhắn mới: {lastMessage.notification?.title}</p>}
            </div>
           
        </>
    );
}

export default App;