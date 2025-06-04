// import { Avatar, Badge, Box, HStack, Image, Text, useToast } from "@chakra-ui/react";
// import { authApi, BASE_URL } from "../../configs/auth";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { getAppToken } from "../../configs/token";
// import {
//     HttpTransportType,
//     HubConnectionBuilder,
//     HubConnectionState,
//     LogLevel,
// } from "@microsoft/signalr";
// import { ChatIcon } from "@chakra-ui/icons";
// import { useForm } from "react-hook-form";

// const useChatInterface = () => {
//     const token = getAppToken();
//     const [connected, setConnected] = useState(false);
//     const [conversations, setConversations] = useState([]);
//     const [activeConversation, setActiveConversation] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [newImages, setNewImages] = useState([]);
//     const [isUploading, setIsUploading] = useState(false);
//     const [users, setUsers] = useState([]);
//     const [loadingMessages, setLoadingMessages] = useState(false);
//     const [loadingConversations, setLoadingConversations] = useState(false);

//     const signalRConnection = useRef(null);
//     const messagesEndRef = useRef(null);
//     const inputRef = useRef(null);
//     const toast = useToast();
//     const activeConversationRef = useRef(activeConversation);


//     // form input
//     const { control, handleSubmit, reset } = useForm({
//         defaultValues: {
//             message: ""
//         }
//     })


//     // Keep activeConversationRef in sync with activeConversation
//     useEffect(() => {
//         activeConversationRef.current = activeConversation;
//     }, [activeConversation]);

//     // Auto-scroll to bottom on new messages
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const showToast = useCallback(
//         (message, status = "error", duration = 3000) => {
//             toast({
//                 title:
//                     status === "error"
//                         ? "Error"
//                         : status === "success"
//                             ? "Success"
//                             : "Notification",
//                 description: message,
//                 status,
//                 duration,
//                 isClosable: true,
//                 position: "top-right",
//             });
//         },
//         [toast]
//     );

//     // Handle receiving new message
//     const handleReceiveMessage = useCallback((message) => {
//         setMessages((prev) => {
//             // Avoid duplicates
//             if (prev.some((m) => m.id === message.id)) return prev;

//             // Only add messages for active conversation
//             if (activeConversationRef.current?.id !== message.conversationId)
//                 return prev;

//             // Replace temp message with real one if exists
//             const index = prev.findIndex(
//                 (m) => m.pending && m.content === message.content
//             );
//             if (index !== -1) {
//                 const newMessages = [...prev];
//                 newMessages[index] = message;
//                 return newMessages;
//             }

//             return [...prev, message];
//         });
//     }, []);

//     // Fetch conversations from API
//     const fetchConversations = useCallback(async () => {
//         if (!token?.accessToken) return;

//         setLoadingConversations(true);
//         try {
//             const res = await authApi({
//                 url: "/api/users/conversations",
//                 method: "get",
//             });
//             if (res) {
//                 const data = await res.data;
//                 setConversations(data);
//             }
//         } catch (err) {
//             console.error("Fetch conversations error:", err);
//             showToast("Failed to load conversations");
//         } finally {
//             setLoadingConversations(false);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     // Fetch users from API
//     const fetchUsers = useCallback(async () => {
//         if (!token?.accessToken) return;

//         try {
//             const res = await authApi({
//                 url: "/api/users",
//                 method: "get",
//             });
//             if (res) {
//                 const data = await res.data;
//                 setUsers(data);
//             }
//         } catch (err) {
//             console.error("Fetch users error:", err);
//             showToast("Failed to load users");
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     // Connect to SignalR hub
//     const connectToSignalR = useCallback(() => {
//         if (!token?.accessToken) return;

//         if (signalRConnection.current?.state === HubConnectionState.Connected) {
//             console.log("Already connected to SignalR");
//             return;
//         }

//         const connection = new HubConnectionBuilder()
//             .withUrl(`${BASE_URL}/chatHub`, {
//                 accessTokenFactory: () => token.accessToken,
//                 transport: HttpTransportType.WebSockets,
//                 skipNegotiation: true,
//             })
//             .configureLogging(LogLevel.Information)
//             .withAutomaticReconnect([0, 2000, 5000, 10000])
//             .build();

//         // Register event handlers
//         connection.on("ReceiveMessage", handleReceiveMessage);
//         connection.on("ConversationCreated", fetchConversations);

//         connection.onclose(() => {
//             setConnected(false);
//             showToast("Connection closed", "warning");
//         });

//         connection.onreconnecting(() => showToast("Reconnecting...", "info"));

//         connection.onreconnected(() => {
//             showToast("Reconnected", "success");
//             const id = activeConversationRef.current?.id;
//             if (id) connection.invoke("JoinConversation", id);
//         });

//         // Start connection
//         connection
//             .start()
//             .then(() => {
//                 signalRConnection.current = connection;
//                 setConnected(true);
//                 showToast("Connected", "success");
//                 fetchConversations();
//                 fetchUsers();
//             })
//             .catch((err) => {
//                 console.error("SignalR connect error:", err);
//                 showToast("Connection error", "error");
//                 setTimeout(connectToSignalR, 3000);
//             });
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     // Initialize SignalR connection on component mount
//     useEffect(() => {
//         console.log("Initializing SignalR connection...");
//         if (token?.accessToken) {
//             connectToSignalR();
//         }
//         return () => {
//             if (signalRConnection.current) {
//                 console.log("Stopping SignalR connection...");
//                 signalRConnection.current.stop();
//             }
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token?.accessToken]);

//     // Select conversation and load messages
//     const selectConversation = useCallback(
//         async (conversation) => {
//             if (!token?.accessToken || activeConversation?.id === conversation.id)
//                 return;

//             const prevId = activeConversation?.id;

//             setActiveConversation(conversation);
//             setMessages([]);
//             setLoadingMessages(true);

//             try {
//                 const res = await authApi({
//                     url: `/api/users/conversations/${conversation.id}/messages`,
//                     method: "get",
//                 });
//                 if (res.data) {
//                     const data = await res.data;
//                     setMessages(data);
//                 }

//                 if (signalRConnection.current?.state === HubConnectionState.Connected) {
//                     if (prevId)
//                         await signalRConnection.current.invoke("LeaveConversation", prevId);
//                     await signalRConnection.current.invoke(
//                         "JoinConversation",
//                         conversation.id
//                     );
//                 }
//             } catch (err) {
//                 console.error("Select conversation error:", err);
//                 showToast("Failed to load messages");
//             } finally {
//                 setLoadingMessages(false);
//             }
//         },
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [activeConversation, token]
//     );

//     const sendMessage = handleSubmit(async (data) => {
//         console.log(data, 'message')
//         if (
//             (!data.message.trim() && newImages.length === 0) ||
//             !activeConversation ||
//             !token?.userId ||
//             !connected
//         )
//             return;
//         const content = data.message.trim();
//         const imagesToSend = [...newImages];

//         // Reset input fields
//         reset({
//             message: ""
//         })
//         setNewImages([]);
//         setIsUploading(false);

//         // Create temporary message for text content
//         if (content) {
//             try {
//                 await signalRConnection.current.invoke(
//                     "SendMessage",
//                     activeConversation.id,
//                     content,
//                     0
//                 );
//             } catch (err) {
//                 console.error("Send text message error:", err);
//                 showToast("Failed to send message");
//             }
//         }
//         // Handle image uploads
//         if (imagesToSend.length > 0) {
//             try {
//                 await signalRConnection.current.invoke(
//                     "SendImages",
//                     activeConversation.id,
//                     imagesToSend
//                 );
//             } catch (err) {
//                 console.error("Send images error:", err);
//                 showToast("Failed to upload images");
//             } finally {
//                 setIsUploading(false);
//             }
//         }

//         // Focus back on input field after sending
//         inputRef.current?.focus();
//     })


//     const handleImageChange = useCallback((images) => {
//         setNewImages((prev) => [...prev, ...images]);
//     }, []);

//     // Memoize conversation list to prevent unnecessary re-renders
//     const conversationList = useMemo(() => {
//         return conversations.map((conv) => (
//             <Box
//                 key={conv.id}
//                 p={3}
//                 bg={activeConversation?.id === conv.id ? "blue.100" : "white"}
//                 borderRadius="md"
//                 cursor="pointer"
//                 _hover={{ bg: "blue.50" }}
//                 onClick={() => selectConversation(conv)}
//                 boxShadow="sm"
//                 transition="all 0.2s"
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="space-between"
//             >
//                 <HStack spacing={3}>
//                     <ChatIcon />
//                     <Text
//                         fontWeight={activeConversation?.id === conv.id ? "bold" : "medium"}
//                     >
//                         {conv.title || `Conversation ${conv.id.substring(0, 8)}...`}
//                     </Text>
//                 </HStack>
//                 {activeConversation?.id === conv.id && (
//                     <Badge colorScheme="blue" borderRadius="full">
//                         Active
//                     </Badge>
//                 )}
//             </Box>
//         ));
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [conversations, activeConversation]);

//     // Memoize user list to prevent unnecessary re-renders
//     const userList = useMemo(() => {
//         return users.map((user) => (
//             <HStack key={user.id} p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
//                 <Avatar size="sm" name={user.username} src={user.avatarUrl} />
//                 <Text fontWeight="medium">{user.username}</Text>
//             </HStack>
//         ));
//     }, [users]);

//     // Memoize message list to prevent unnecessary re-renders
//     const messageList = useMemo(() => {
//         return messages.map((msg) => (
//             <Box
//                 py={1}
//                 key={msg.id}
//                 alignSelf={msg.senderId === token?.userId ? "flex-end" : "flex-start"}
//             >
//                 <Box
//                     bg={msg.senderId === token?.userId ? "blue.400" : "gray.300"}
//                     color={msg.senderId === token?.userId ? "white" : "black"}
//                     px={4}
//                     py={2}
//                     borderRadius="lg"
//                     maxW="300px"
//                 >
//                     <Text fontSize="sm" fontWeight="bold">
//                         {msg.senderName}
//                     </Text>
//                     {msg.messageType === "Image" || msg.messageType == 1 ? (
//                         <Image
//                             src={`${BASE_URL}${msg.content}`}
//                             alt={`Preview ${msg.content}`}
//                             objectFit="cover"
//                             borderRadius="md"
//                         />
//                     ) : (
//                         <Text>{msg.content}</Text>
//                     )}
//                     {/* {msg.pending && <Text fontSize="xs" color="yellow.400">Sending...</Text>} */}
//                     {msg.failed && (
//                         <Text fontSize="xs" color="red.400">
//                             Failed
//                         </Text>
//                     )}
//                 </Box>
//             </Box>
//         ));
//     }, [messages, token]);

//     // const isInputDisabled = useMemo(
//     //     () => !connected || !activeConversation,
//     //     [connected, activeConversation]
//     // );
//     // const isSendButtonDisabled = useMemo(
//     //     () =>
//     //         (!getValues("input").trim() && newImages.length === 0) ||
//     //         !connected ||
//     //         isUploading,
//     //     [getValues("input"), newImages, connected, isUploading]
//     // );

//     // Status indicator for connection state
//     const connectionStatus = useMemo(() => {
//         if (!token?.accessToken)
//             return { color: "red.500", text: "Not authenticated" };
//         if (!connected) return { color: "orange.500", text: "Disconnected" };
//         return { color: "green.500", text: "Connected" };
//     }, [connected, token]);

//     return [
//         {
//             isInputDisabled: false,
//             isSendButtonDisabled: false,
//             connectionStatus,
//             loadingMessages,
//             loadingConversations,
//             activeConversation,
//             messages,
//             newMessage,
//             newImages,
//             users,
//             conversationList,
//             userList,
//             messageList,
//             messagesEndRef,
//             isUploading,
//             control
//         },
//         {
//             connectToSignalR,
//             sendMessage,
//             handleImageChange,
//             setNewImages,
//             setNewMessage,
//         },
//     ];
// };
// export default useChatInterface;
