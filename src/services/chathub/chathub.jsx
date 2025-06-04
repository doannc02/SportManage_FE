// import * as signalR from '@microsoft/signalr';
// import { BASE_URL } from '../../configs/auth';

// class SignalRService {
//     constructor() {
//         this.connection = null;
//         this.messageCallbacks = [];
//         this.conversationCreatedCallbacks = [];
//     }

//     // Initialize connection with the backend
//     async initializeConnection(token) {
//         if (!token || !token.accessToken) {
//             console.error('No access token provided');
//             return false;
//         }

//         this.connection = new signalR.HubConnectionBuilder()
//             .withUrl(`${BASE_URL}/chathub`, {    // <-- chú ý chathub phải đúng casing backend nếu có
//                 accessTokenFactory: () => token.accessToken,
//                 withCredentials: false,
//             })
//             .withAutomaticReconnect()
//             .configureLogging(signalR.LogLevel.Information)
//             .build();

//         // Khi nhận tin nhắn
//         this.connection.on('ReceiveMessage', (message) => {
//             console.log('Event ReceiveMessage triggered with:', message);
//             if (this.messageCallbacks.length === 0) {
//                 console.warn('No callbacks registered for ReceiveMessage.');
//             }
//             this.messageCallbacks.forEach(callback => callback(message));
//         });

//         // Khi có cuộc trò chuyện mới
//         this.connection.on('ConversationCreated', (conversation) => {
//             console.log('Conversation created:', conversation);
//             this.conversationCreatedCallbacks.forEach(callback => callback(conversation));
//         });

//         // Khi kết nối bị đóng
//         this.connection.onclose((error) => {
//             console.error('SignalR connection closed:', error);
//         });

//         try {
//             await this.connection.start();
//             console.log('SignalR connected.');
//             return true;
//         } catch (err) {
//             console.error('Error starting SignalR connection:', err);
//             return false;
//         }
//     }

//     // Subcribe nhận tin nhắn
//     onReceiveMessage(callback) {
//         console.log('log', this.messageCallbacks)

//         this.messageCallbacks.push(callback);
//     }

//     // Subcribe khi có cuộc trò chuyện mới
//     onConversationCreated(callback) {
//         this.conversationCreatedCallbacks.push(callback);
//     }

//     // Unsubscribe
//     offReceiveMessage(callback) {
//         this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
//     }

//     offConversationCreated(callback) {
//         this.conversationCreatedCallbacks = this.conversationCreatedCallbacks.filter(cb => cb !== callback);
//     }

//     // Gửi tin nhắn (conversationId: Guid, content: string)
//     async sendMessage(conversationId, content) {
//         if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
//             console.error('Connection is not established.');
//             return false;
//         }

//         try {
//             await this.connection.invoke('SendMessage', conversationId, content);
//             return true;
//         } catch (err) {
//             console.error('Error sending message:', err);
//             return false;
//         }
//     }

//     // Tạo mới cuộc trò chuyện (title: string, participantIds: Guid[])
//     async createConversation(title, participantIds) {
//         if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
//             console.error('Connection is not established.');
//             return false;
//         }

//         try {
//             await this.connection.invoke('CreateConversation', title, participantIds);
//             return true;
//         } catch (err) {
//             console.error('Error creating conversation:', err);
//             return false;
//         }
//     }

//     // Tham gia một nhóm (conversationId: Guid) - nếu cần join thủ công (optional)
//     async joinGroup(conversationId) {
//         if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
//             console.error('Connection is not established.');
//             return false;
//         }

//         try {
//             await this.connection.invoke('JoinGroup', conversationId);
//             console.log('Joined group', conversationId);
//             return true;
//         } catch (err) {
//             console.error('Error joining group:', err);
//             return false;
//         }
//     }

//     // Disconnect
//     async disconnect() {
//         if (this.connection) {
//             await this.connection.stop();
//             this.connection = null;
//             console.log('SignalR connection closed.');
//         }
//     }
// }

// // Singleton
// const signalRService = new SignalRService();
// export default signalRService;
