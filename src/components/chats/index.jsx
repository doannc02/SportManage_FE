import {
    Box, Button, Text, VStack, HStack, Heading, Spinner, Image, IconButton, Badge, Tooltip, Flex,
    useToast
} from '@chakra-ui/react';
import { AttachmentIcon, ChatIcon, AddIcon } from '@chakra-ui/icons';
import { BASE_URL } from '../../configs/auth';
import { MultiImageUploader } from '../atoms/ImageUploader';
import CoreInput from '../atoms/CoreInput';
import { useChatInterface } from '../../Contexts/ChatContext';
import { useEffect, useState } from 'react';

const ChatInterface = () => {
    const toast = useToast();
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [hasAdminChat, setHasAdminChat] = useState(false);
    const [state, actions] = useChatInterface();

    const {
        isInputDisabled, isSendButtonDisabled, connectionStatus, loadingMessages,
        loadingConversations, activeConversation, messages, newImages, control,
        conversationList, userList, messageList, messagesEndRef,
        currentUser, connection, conversations, unreadCounts
    } = state;

    const {
        sendMessage, handleImageChange, setNewImages, setActiveConversation,
        loadMessages, createAdminConversation, fetchConversations, markConversationAsRead
    } = actions;

    const isRole = (target) =>
        currentUser?.roles?.some(r => (r.roleName || r.RoleName)?.toLowerCase() === target.toLowerCase());

    const isAdmin = isRole('admin');
    const isUser = isRole('user');

    useEffect(() => {
        if (!currentUser?.id || !isUser) return;

        const existingConv = conversations.find(conv =>
            isAdmin && conv.participants.find(p => p.userId === currentUser.id)
        );

        if (existingConv) {
            setActiveConversation(existingConv);
            loadMessages(existingConv.id);
            setHasAdminChat(true);
        } else {
            setHasAdminChat(false);
        }
    }, [currentUser]);

    const createAdminChat = async () => {
        if (!currentUser?.id) {
            toast({ title: 'Error', description: 'You must be logged in to create a chat', status: 'error', duration: 3000, isClosable: true });
            return;
        }

        setIsCreatingChat(true);
        try {
            const existingConv = conversations.find(conv =>
                isAdmin && conv.participants.find(p => p.userId === currentUser.id)
            );

            if (existingConv) {
                setActiveConversation(existingConv);
                loadMessages(existingConv.id);
                toast({ title: 'Chat Opened', description: 'You already have a support chat with admin', status: 'info', duration: 3000, isClosable: true });
            } else {
                const newConv = await createAdminConversation(currentUser.id);
                if (newConv) {
                    setActiveConversation(newConv);
                    loadMessages(newConv.id);
                    toast({ title: 'Success', description: 'Support chat with admin created', status: 'success', duration: 3000, isClosable: true });
                    if (connection?.state === 'Connected') {
                        await connection.invoke('JoinConversation', newConv.id);
                    }
                    fetchConversations();
                }
            }

            setHasAdminChat(true);
        } catch (err) {
            console.error('Error creating admin chat:', err);
            toast({ title: 'Error', description: 'Failed to create admin chat', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsCreatingChat(false);
        }
    };

    useEffect(() => {
        if (connection && activeConversation?.id) {
            connection.invoke('JoinConversation', activeConversation.id);
        }
    }, [connection, activeConversation]);

    const renderImagePreviews = () => (
        <HStack spacing={2} mb={3} p={2} bg="gray.50" borderRadius="md" overflowX="auto">
            {newImages.map((img, idx) => {
                const src = typeof img === 'string' ? `${BASE_URL}${img}` : URL.createObjectURL(img);
                return (
                    <Box key={idx} position="relative" borderRadius="md">
                        <Image src={src} alt={`Preview ${idx}`} boxSize="60px" objectFit="cover" />
                        <IconButton
                            aria-label="Remove image"
                            icon={<Text fontSize="xs">×</Text>}
                            size="xs"
                            colorScheme="red"
                            position="absolute"
                            top="2px"
                            right="2px"
                            borderRadius="full"
                            onClick={() => setNewImages(newImages.filter((_, i) => i !== idx))}
                        />
                    </Box>
                );
            })}
            <Badge colorScheme="blue" borderRadius="full" px={2}>
                {newImages.length} image{newImages.length > 1 ? 's' : ''}
            </Badge>
        </HStack>
    );

    const shouldDisableAdminChatBtn = conversations.length > 0 && isUser;

    // Custom render để hiển thị danh sách cuộc hội thoại với số tin nhắn chưa đọc
    const renderConversationList = () => {
        return conversations.map((conv) => (
            <Box
                key={conv.id}
                p={3}
                bg={activeConversation?.id === conv.id ? "blue.100" : "white"}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "blue.50" }}
                onClick={() => {
                    setActiveConversation(conv);
                    loadMessages(conv.id);
                    markConversationAsRead(conv.id); // <-- Thêm dòng này
                }}
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
                    {unreadCounts && unreadCounts[conv.id] > 0 && (
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
    };

    const handleSelectConversation = (conv) => {
        setActiveConversation(conv);
        loadMessages(conv.id);
        markConversationAsRead(conv.id); // <-- Xóa trạng thái chưa đọc
    };

    return (
        <Flex h="80vh" border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            {/* Sidebar */}
            <Box width={{ base: '100%', md: '300px' }} bg="gray.50" p={4} display="flex" flexDirection="column" borderRight="1px solid" borderColor="gray.200">
                <HStack justifyContent="space-between" mb={4}>
                    <Heading size="sm">Conversations</Heading>
                    <Tooltip label={connectionStatus.text} hasArrow>
                        <Box w={3} h={3} borderRadius="full" bg={connectionStatus.color} />
                    </Tooltip>
                </HStack>

                {isUser && (
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        mb={4}
                        onClick={createAdminChat}
                        isDisabled={shouldDisableAdminChatBtn || isCreatingChat}
                    >
                        {shouldDisableAdminChatBtn ? 'Admin Chat Exists' : 'Chat with Admin'}
                    </Button>
                )}

                <VStack spacing={2} align="stretch" flex="1" overflowY="auto">
                    {loadingConversations ? (
                        <Box textAlign="center" py={4}><Spinner /></Box>
                    ) : (
                        conversations.length > 0 ? renderConversationList() : (
                            <Text color="gray.500" textAlign="center" py={4}>
                                {isUser && !hasAdminChat ? "Click 'Chat with Admin' to start" : "No conversations yet"}
                            </Text>
                        )
                    )}
                </VStack>

                <Box mt={4}>
                    <Heading size="xs" mb={2}>Online Users</Heading>
                    <VStack spacing={1} align="stretch" maxH="200px" overflowY="auto" p={1} borderRadius="md" bg="white" border="1px solid" borderColor="gray.100">
                        {userList.length > 0 ? userList : (
                            <Text color="gray.500" textAlign="center" py={2}>No users online</Text>
                        )}
                    </VStack>
                </Box>
            </Box>

            {/* Chat Section */}
            <Flex flex="1" direction="column" bg="white">
                {activeConversation && (
                    <Box p={3} borderBottom="1px solid" borderColor="gray.200">
                        <Heading size="sm">{activeConversation.title || `Conversation ${activeConversation.id.slice(0, 8)}...`}</Heading>
                    </Box>
                )}

                {!activeConversation ? (
                    <Flex flex="1" align="center" justify="center" bg="gray.50">
                        <VStack spacing={3}>
                            <ChatIcon boxSize={10} color="gray.400" />
                            <Text color="gray.500">
                                {isUser && !hasAdminChat ? "Click 'Chat with Admin' to get support" : "Select a conversation to start chatting"}
                            </Text>
                        </VStack>
                    </Flex>
                ) : (
                    <Box flex="1" overflowY="auto" p={4} bg="gray.50">
                        {loadingMessages ? (
                            <Flex justify="center" my={8}><Spinner /></Flex>
                        ) : messages.length > 0 ? (
                            <Flex direction="column">
                                {messageList}
                                <div ref={messagesEndRef} />
                            </Flex>
                        ) : (
                            <Text color="gray.500" textAlign="center" py={8}>No messages yet. Start the conversation!</Text>
                        )}
                    </Box>
                )}

                <Box as="form" onSubmit={sendMessage} p={3} borderTop="1px solid" borderColor="gray.200" bg="white">
                    {newImages.length > 0 && renderImagePreviews()}
                    <HStack spacing={3} align="center">
                        <MultiImageUploader
                            shouldReset
                            width="40px"
                            height="40px"
                            onChange={handleImageChange}
                            customButton={
                                <IconButton
                                    aria-label="Upload images"
                                    icon={<AttachmentIcon />}
                                    size="md"
                                    colorScheme="gray"
                                    borderRadius="full"
                                    isDisabled={isInputDisabled}
                                />
                            }
                        />
                        <CoreInput
                            sx={{ minWidth: '460px' }}
                            height="10px"
                            autoExpandEmpty={false}
                            name="message"
                            placeholder="Nhập tin nhắn..."
                            isDisabled={isInputDisabled}
                            bg="gray.100"
                            borderRadius="full"
                            control={control}
                            maxLength={500}
                        />
                        <Button type="submit" colorScheme="blue" borderRadius="full" isDisabled={isSendButtonDisabled && ('message')}>Gửi</Button>
                    </HStack>
                </Box>
            </Flex>
        </Flex>
    );
};

export default ChatInterface;