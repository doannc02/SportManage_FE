import { useCallback, useEffect } from 'react';
import AllRouter from './pages/AllRouter';
import usePushNotifications from './hooks/usePushNotifications';
import { getAppToken } from './configs/token';

function App() {
  const token = getAppToken();

  const isUserAllowed = useCallback(() => {
    // Giả định `token` là dấu hiệu người dùng đã đăng nhập
    return !!token;
  }, [token]);

  const {
    notificationPermission,
    requestForToken,
  } = usePushNotifications();

  useEffect(() => {
    console.log('Notification permission status:', notificationPermission);
    console.log('User has token:', isUserAllowed());
  }, [notificationPermission, isUserAllowed]);

  // Điều kiện để hiển thị nút
  const shouldShowNotificationButton =
    isUserAllowed() && // Chỉ hiển thị nếu người dùng đã đăng nhập
    notificationPermission === 'default'; // Và quyền thông báo chưa được hỏi hoặc chưa được cấp

  console.log('App component rendered', notificationPermission);
  return (
    <>
      <AllRouter />

      {/* Hiển thị button kích hoạt thông báo */}
      {shouldShowNotificationButton && (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            Bật thông báo để nhận tin nhắn mới nhất
          </p>
          <button
            onClick={requestForToken}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Bật thông báo
          </button>
        </div>
      )}
    </>
  );
}

export default App;