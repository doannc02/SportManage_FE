import { Box } from "@chakra-ui/react";
import { Avatar, Badge, HStack, Image, Text, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import {
    HttpTransportType,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
} from "@microsoft/signalr";
import { ChatIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { getAppToken } from "../configs/token";
import { authApi, BASE_URL } from "../configs/auth";
import { playNotificationSound } from "../helpers/soundNotification";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const state = useChatInterfaceInternal();
    return (
        <ChatContext.Provider value={state}>
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useChatInterface = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChatInterface must be used within ChatProvider");
    return context;
};

export const useChatInterfaceInternal = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    // Thêm state mới để theo dõi số lượng tin nhắn chưa đọc cho từng cuộc hội thoại
    const [unreadCounts, setUnreadCounts] = useState({});
    const [messagesByConversation, setMessagesByConversation] = useState({});
    const token = getAppToken();
    const [connected, setConnected] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const signalRConnection = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const toast = useToast();
    const activeConversationRef = useRef(activeConversation);
    const originalTitle = useRef(document.title);

    const updateDocumentTitle = (msg) => {
        if (document.hidden) {
            document.title = '💬 Bạn có tin nhắn mới!';
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                document.title = originalTitle.current;
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // form input 
    const { control, watch, handleSubmit, reset } = useForm({
        defaultValues: {
            message: ""
        }
    });

    // Fetch current user information
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!token?.accessToken) return;

            try {
                const res = await authApi({
                    url: `/api/users/current`,
                    method: "get",
                });
                if (res?.data) {
                    setCurrentUser(res.data);
                }
            } catch (err) {
                console.error("Fetch current user error:", err);
            }
        };

        fetchCurrentUser();
    }, [token?.accessToken]);

    // Keep activeConversationRef in sync with activeConversation
    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const showToast = useCallback(
        (message, status = "error", duration = 3000) => {
            toast({
                title:
                    status === "error"
                        ? "Error"
                        : status === "success"
                            ? "Success"
                            : "Notification",
                description: message,
                status,
                duration,
                isClosable: true,
                position: "top-right",
            });
        },
        [toast]
    );

    // Handle receiving new message
    const handleReceiveMessage = useCallback((message) => {
        if (message.senderId !== token.userId) {
            setUnreadCount((count) => count + 1);

            setUnreadCounts(prev => {
                const conversationId = message.conversationId;
                if (activeConversationRef.current?.id !== conversationId) {
                    return {
                        ...prev,
                        [conversationId]: (prev[conversationId] || 0) + 1
                    };
                }
                return prev;
            });

            playNotificationSound();
            updateDocumentTitle(message);
        }

        // CHỈ thêm vào messages nếu conversationId trùng với activeConversation
        if (activeConversationRef.current?.id === message.conversationId) {
            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;

                const index = prev.findIndex(
                    (m) => m.pending && m.content === message.content
                );
                if (index !== -1) {
                    const newMessages = [...prev];
                    newMessages[index] = message;
                    return newMessages;
                }

                return [...prev, message];
            });
        }
    }, [token?.userId]);

    // Fetch conversations from API
    const fetchConversations = useCallback(async () => {
        if (!token?.accessToken) return;

        setLoadingConversations(true);
        try {
            const res = await authApi({
                url: "/api/users/conversations",
                method: "get",
            });
            if (res) {
                const data = await res.data;
                setConversations(data);
            }
        } catch (err) {
            console.error("Fetch conversations error:", err);
            showToast("Failed to load conversations");
        } finally {
            setLoadingConversations(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        if (!token?.accessToken) return;

        try {
            const res = await authApi({
                url: "/api/users",
                method: "get",
            });
            if (res) {
                const data = await res.data;
                setUsers(data);
            }
        } catch (err) {
            console.error("Fetch users error:", err);
            showToast("Failed to load users");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Load messages for a specific conversation
    const loadMessages = useCallback(async (conversationId) => {
        if (!token?.accessToken || !conversationId) return;

        setLoadingMessages(true);
        try {
            const res = await authApi({
                url: `/api/users/conversations/${conversationId}/messages`,
                method: "get",
            });
            if (res.data) {
                setMessages(res.data);
            }
        } catch (err) {
            console.error("Load messages error:", err);
            showToast("Failed to load messages");
        } finally {
            setLoadingMessages(false);
        }
    }, [token?.accessToken, showToast]);

    // Connect to SignalR hub
    const connectToSignalR = useCallback(() => {
        if (!token?.accessToken) return;

        if (signalRConnection.current?.state === HubConnectionState.Connected) {
            console.log("Already connected to SignalR");
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

        // Register event handlers
        connection.on("ReceiveMessage", handleReceiveMessage);
        connection.on("ConversationCreated", fetchConversations);

        connection.onclose(() => {
            setConnected(false);
            showToast("Connection closed", "warning");
        });

        connection.onreconnecting(() => showToast("Reconnecting...", "info"));

        connection.onreconnected(() => {
            showToast("Reconnected", "success");
            const id = activeConversationRef.current?.id;
            if (id) connection.invoke("JoinConversation", id);
        });

        // Start connection
        connection
            .start()
            .then(() => {
                signalRConnection.current = connection;
                setConnected(true);
                showToast("Connected", "success");
                fetchConversations();
                fetchUsers();
            })
            .catch((err) => {
                console.error("SignalR connect error:", err);
                showToast("Connection error", "error");
                setTimeout(connectToSignalR, 3000);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Initialize SignalR connection on component mount
    useEffect(() => {
        console.log("Initializing SignalR connection...");
        if (token?.accessToken) {
            connectToSignalR();
        }
        return () => {
            if (signalRConnection.current) {
                console.log("Stopping SignalR connection...");
                signalRConnection.current.stop();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token?.accessToken]);

    // Select conversation and load messages
    const selectConversation = useCallback(
        async (conversation) => {
            if (!token?.accessToken || activeConversation?.id === conversation.id)
                return;

            const prevId = activeConversation?.id;

            setActiveConversation(conversation);
            markConversationAsRead(conversation.id);
            setMessages([]);
            setLoadingMessages(true);

            try {
                const res = await authApi({
                    url: `/api/users/conversations/${conversation.id}/messages`,
                    method: "get",
                });
                if (res.data) {
                    const data = await res.data;
                    setMessages(data);
                }

                if (signalRConnection.current?.state === HubConnectionState.Connected) {
                    if (prevId)
                        //  await signalRConnection.current.invoke("LeaveConversation", prevId);
                        await signalRConnection.current.invoke(
                            "JoinConversation",
                            conversation.id
                        );
                }
            } catch (err) {
                console.error("Select conversation error:", err);
                showToast("Failed to load messages 2");
            } finally {
                setLoadingMessages(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeConversation, token]
    );

    // Mark conversation as read
    const markConversationAsRead = useCallback((conversationId) => {
        setUnreadCounts(prev => {
            const unreadOfConv = prev[conversationId] || 0;
            if (unreadOfConv === 0) return prev;
            // Giảm tổng số lượng chưa đọc
            setUnreadCount(count => Math.max(0, count - unreadOfConv));
            return {
                ...prev,
                [conversationId]: 0
            };
        });
        // Có thể gọi API đánh dấu đã đọc ở đây nếu cần
    }, []);

    const sendMessage = handleSubmit(async (data) => {
        if (
            (!data.message.trim() && newImages.length === 0) ||
            !activeConversation ||
            !token?.userId ||
            !connected
        )
            return;

        const content = data.message.trim();
        const imagesToSend = [...newImages];

        // Reset input fields
        reset({
            message: ""
        });
        setNewImages([]);
        setIsUploading(false);

        // Create temporary message for text content
        if (content) {
            try {
                await signalRConnection.current.invoke(
                    "SendMessage",
                    activeConversation.id,
                    content,
                    0
                );
            } catch (err) {
                console.error("Send text message error:", err);
                showToast("Failed to send message");
            }
        }
        // Handle image uploads
        if (imagesToSend.length > 0) {
            try {
                await signalRConnection.current.invoke(
                    "SendImages",
                    activeConversation.id,
                    imagesToSend
                );
            } catch (err) {
                console.error("Send images error:", err);
                showToast("Failed to upload images");
            } finally {
                setIsUploading(false);
            }
        }

        // Focus back on input field after sending
        inputRef.current?.focus();
    });

    const handleImageChange = useCallback((images) => {
        setNewImages((prev) => [...prev, ...images]);
    }, []);

    // Create new conversation with admin
    const createAdminConversation = useCallback(async (userId) => {
        if (!token?.accessToken || !userId) return null;

        try {
            const res = await authApi(
                {
                    url: `/api/users/conversations`,
                    method: "post",
                    data: {
                        participants: [userId],
                        title: 'Support with Admin' + `${token?.username}`
                    }
                })

            const created = res.data;

            if (created?.id) {
                // Check if already exists
                const isExist = conversations.some(c => c.id === created.id);
                if (!isExist) {
                    setConversations(prev => [...prev, created]);
                }
                return created;
            }

            return null;
        } catch (error) {
            console.error("Create admin conversation error:", error);
            showToast("Không thể tạo hội thoại với admin", "error");
            return null;
        }
    }, [token?.accessToken, conversations]);


    // Memoize conversation list to prevent unnecessary re-renders
    const conversationList = useMemo(() => {
        return conversations.map((conv) => (
            <Box
                key={conv.id}
                p={3}
                bg={activeConversation?.id === conv.id ? "blue.100" : "white"}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "blue.50" }}
                onClick={() => selectConversation(conv)}
                boxShadow="sm"
                transition="all 0.2s"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <HStack spacing={3}>
                    <ChatIcon />
                    <Text
                        fontWeight={activeConversation?.id === conv.id ? "bold" : "medium"}
                    >
                        {conv.title || `Conversation ${conv.id.substring(0, 8)}...`}
                    </Text>
                </HStack>
                <HStack>
                    {unreadCounts[conv.id] > 0 && (
                        <Badge colorScheme="red" borderRadius="full">
                            {unreadCounts[conv.id]}
                        </Badge>
                    )}
                    {activeConversation?.id === conv.id && (
                        <Badge colorScheme="blue" borderRadius="full">
                            Active
                        </Badge>
                    )}
                </HStack>
            </Box>
        ));
    }, [conversations, activeConversation, unreadCounts]);
    // Memoize user list to prevent unnecessary re-renders
    const userList = useMemo(() => {
        return users.map((user) => (
            <HStack key={user.id} p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
                <Avatar size="sm" name={user.username} src={user.avatarUrl} />
                <Text fontWeight="medium">{user.username}</Text>
            </HStack>
        ));
    }, [users]);

    // Memoize message list to prevent unnecessary re-renders
    const messageList = useMemo(() => {
        return messages.map((msg) => (
            <Box
                py={1}
                key={msg.id}
                alignSelf={msg.senderId === token?.userId ? "flex-end" : "flex-start"}
            >
                <Box
                    bg={msg.senderId === token?.userId ? "blue.400" : "gray.300"}
                    color={msg.senderId === token?.userId ? "white" : "black"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxW="300px"
                >
                    <Text fontSize="sm" fontWeight="bold">
                        {msg.senderName}
                    </Text>
                    {msg.messageType === "Image" || msg.messageType == 1 ? (
                        <Image
                            src={`${BASE_URL}${msg.content}`}
                            alt={`Preview ${msg.content}`}
                            objectFit="cover"
                            borderRadius="md"
                        />
                    ) : (
                        <Text>{msg.content}</Text>
                    )}
                    {msg.failed && (
                        <Text fontSize="xs" color="red.400">
                            Failed
                        </Text>
                    )}
                </Box>
            </Box>
        ));
    }, [messages, token]);

    // Status indicator for connection state
    const connectionStatus = useMemo(() => {
        if (!token?.accessToken)
            return { color: "red.500", text: "Not authenticated" };
        if (!connected) return { color: "orange.500", text: "Disconnected" };
        return { color: "green.500", text: "Connected" };
    }, [connected, token]);

    return [
        {
            isInputDisabled: !connected || !activeConversation,
            isSendButtonDisabled: !watch('message') || !connected || isUploading,
            connectionStatus,
            loadingMessages,
            loadingConversations,
            activeConversation,
            messages,
            newMessage,
            newImages,
            isUploading,
            control,
            conversationList,
            userList,
            messageList,
            messagesEndRef,
            currentUser,
            connection: signalRConnection.current,
            unreadCount,
            unreadCounts,
            conversations
        },
        {
            connectToSignalR,
            sendMessage,
            handleImageChange,
            setNewImages,
            setNewMessage,
            setUnreadCount,
            setActiveConversation,
            loadMessages,
            createAdminConversation,
            fetchConversations,
            markConversationAsRead,
        },
    ];
};