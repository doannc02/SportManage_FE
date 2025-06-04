import {
    HubConnectionBuilder,
    HttpTransportType,
    LogLevel,
    HubConnectionState
} from '@microsoft/signalr';
import { BASE_URL } from './auth';

export const createSignalRConnection = ({
    token,
    handlers,
    connectionRef,
    activeConversationRef,
    showToast,
    onConnected
}) => {
    if (!token?.accessToken) return;

    // Nếu đã connected thì không tạo lại
    if (connectionRef.current?.state === HubConnectionState.Connected) {
        console.log("SignalR already connected");
        return;
    }

    const connection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/chatHub`, {
            accessTokenFactory: () => token.accessToken,
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .build();

    // Gán các handler sự kiện
    connection.on("ReceiveMessage", handlers.onReceiveMessage);
    connection.on("ConversationCreated", handlers.onConversationCreated);

    connection.onclose(() => {
        handlers.onClose?.();
        showToast?.("SignalR connection closed", "warning");
    });

    connection.onreconnecting(() => {
        handlers.onReconnecting?.();
        showToast?.("Reconnecting to SignalR...", "info");
    });

    connection.onreconnected(() => {
        handlers.onReconnected?.();
        showToast?.("Reconnected to SignalR", "success");

        const convId = activeConversationRef?.current?.id;
        if (convId) {
            connection.invoke("JoinConversation", convId).catch(console.error);
        }
    });

    // Bắt đầu kết nối
    connection
        .start()
        .then(() => {
            connectionRef.current = connection;
            showToast?.("Connected to SignalR", "success");
            onConnected?.(); // Load data sau khi kết nối
        })
        .catch(err => {
            console.error("SignalR connect error:", err);
            showToast?.("SignalR connection failed", "error");
        });
};
