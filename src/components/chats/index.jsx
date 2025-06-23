import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Heading,
  Spinner,
  Image,
  IconButton,
  Badge,
  Tooltip,
  Flex,
  useToast,
  useMediaQuery, // Import useMediaQuery
} from "@chakra-ui/react";
import { AttachmentIcon, ChatIcon, AddIcon, MinusIcon } from "@chakra-ui/icons"; // Import MinusIcon for collapse
import { BASE_URL } from "../../configs/auth";
import { MultiImageUploader } from "../atoms/ImageUploader";
import CoreInput from "../atoms/CoreInput";
import { useChatInterface } from "../../Contexts/ChatContext";
import { useEffect, useState, useRef } from "react"; // Import useRef

const ChatInterface = () => {
  const toast = useToast();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [hasAdminChat, setHasAdminChat] = useState(false);
  // State để quản lý việc ẩn/hiện sidebar trên mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Sử dụng useMediaQuery để phát hiện mobile
  const [isMobile] = useMediaQuery("(max-width: 768px)"); // sm or md breakpoint
  const [state, actions] = useChatInterface();

  const {
    isInputDisabled,
    isSendButtonDisabled,
    connectionStatus,
    loadingMessages,
    loadingConversations,
    activeConversation,
    messages,
    newImages,
    control,
    conversationList,
    userList,
    messageList,
    messagesEndRef,
    currentUser,
    connection,
    conversations,
    unreadCounts,
  } = state;

  const {
    sendMessage,
    handleImageChange,
    setNewImages,
    setActiveConversation,
    loadMessages,
    createAdminConversation,
    fetchConversations,
    markConversationAsRead,
  } = actions;

  const isRole = (target) =>
    currentUser?.roles?.some(
      (r) => (r.roleName || r.RoleName)?.toLowerCase() === target.toLowerCase()
    );

  const isAdmin = isRole("admin");
  const isUser = isRole("user");

  // Ref cho phần cuối tin nhắn để cuộn tự động
  const chatMessagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser?.id || !isUser) return;

    const existingConv = conversations.find(
      (conv) =>
        isAdmin && conv.participants.find((p) => p.userId === currentUser.id)
    );

    if (existingConv) {
      setActiveConversation(existingConv);
      loadMessages(existingConv.id);
      setHasAdminChat(true);
    } else {
      setHasAdminChat(false);
    }
  }, [
    currentUser,
    conversations,
    isAdmin,
    isUser,
    setActiveConversation,
    loadMessages,
  ]);

  const createAdminChat = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingChat(true);
    try {
      const existingConv = conversations.find(
        (conv) =>
          isAdmin && conv.participants.find((p) => p.userId === currentUser.id)
      );

      if (existingConv) {
        setActiveConversation(existingConv);
        loadMessages(existingConv.id);
        toast({
          title: "Chat Opened",
          description: "You already have a support chat with admin",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        if (isMobile) setIsSidebarOpen(false); // Ẩn sidebar sau khi chọn trên mobile
      } else {
        const newConv = await createAdminConversation(currentUser.id);
        if (newConv) {
          setActiveConversation(newConv);
          loadMessages(newConv.id);
          toast({
            title: "Success",
            description: "Support chat with admin created",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          if (connection?.state === "Connected") {
            await connection.invoke("JoinConversation", newConv.id);
          }
          fetchConversations();
          if (isMobile) setIsSidebarOpen(false); // Ẩn sidebar sau khi tạo trên mobile
        }
      }

      setHasAdminChat(true);
    } catch (err) {
      console.error("Error creating admin chat:", err);
      toast({
        title: "Error",
        description: "Failed to create admin chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  useEffect(() => {
    if (connection && activeConversation?.id) {
      connection.invoke("JoinConversation", activeConversation.id);
    }
  }, [connection, activeConversation]);

  // Cuộn xuống cuối tin nhắn khi có tin nhắn mới hoặc tin nhắn được tải
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // messages hoặc messageList tùy thuộc vào cách bạn quản lý tin nhắn

  const renderImagePreviews = () => (
    <HStack
      spacing={2}
      mb={3}
      p={2}
      bg="gray.50"
      borderRadius="md"
      overflowX="auto"
      flexShrink={0}
    >
      {newImages.map((img, idx) => {
        const src =
          typeof img === "string"
            ? `${BASE_URL}/${img}`
            : URL.createObjectURL(img);
        return (
          <Box key={idx} position="relative" borderRadius="md">
            <Image
              src={src}
              alt={`Preview ${idx}`}
              boxSize="60px"
              objectFit="cover"
            />
            <IconButton
              aria-label="Remove image"
              icon={<Text fontSize="xs">×</Text>}
              size="xs"
              colorScheme="red"
              position="absolute"
              top="2px"
              right="2px"
              borderRadius="full"
              onClick={() =>
                setNewImages(newImages.filter((_, i) => i !== idx))
              }
            />
          </Box>
        );
      })}
      <Badge colorScheme="blue" borderRadius="full" px={2}>
        {newImages.length} image{newImages.length > 1 ? "s" : ""}
      </Badge>
    </HStack>
  );

  const shouldDisableAdminChatBtn =
    conversations.length > 0 && isUser && hasAdminChat;

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    loadMessages(conv.id);
    markConversationAsRead(conv.id);
    if (isMobile) setIsSidebarOpen(false); // Ẩn sidebar khi chọn cuộc trò chuyện trên mobile
  };

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
        onClick={() => handleSelectConversation(conv)}
        boxShadow="sm"
        transition="all 0.2s"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack spacing={3} overflow="hidden">
          <ChatIcon />
          <Text
            fontWeight={activeConversation?.id === conv.id ? "bold" : "medium"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {conv.title || `Conversation ${conv.id.substring(0, 8)}...`}
          </Text>
        </HStack>
        <HStack flexShrink={0}>
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

  return (
    <Flex
      h={{ base: "70vh", md: "80vh" }} // Chiều cao linh hoạt hơn cho mobile
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      overflow="hidden"
      direction={{ base: "column", md: "row" }}
    >
      {/* Sidebar cho desktop, nút toggle cho mobile */}
      {isMobile && (
        <Flex
          p={2}
          borderBottom="1px solid"
          borderColor="gray.200"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="sm">
            {isSidebarOpen
              ? "Conversations"
              : activeConversation?.title || "Select Chat"}
          </Heading>
          <IconButton
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            icon={isSidebarOpen ? <MinusIcon /> : <ChatIcon />}
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Flex>
      )}

      {/* Sidebar (hiện luôn trên desktop, có thể ẩn/hiện trên mobile) */}
      {(isSidebarOpen || !isMobile) && (
        <Box
          width={{ base: "100%", md: "300px" }}
          bg="gray.50"
          p={4}
          display="flex"
          flexDirection="column"
          borderRight={{ base: "none", md: "1px solid" }}
          borderBottom={{ base: "1px solid", md: "none" }}
          borderColor="gray.200"
          overflowY="auto"
          // Chiều cao sidebar trên mobile sẽ thay đổi
          maxH={isMobile ? (isSidebarOpen ? "70%" : "0") : "none"}
          flexShrink={0} // Không co lại trên mobile khi nội dung chat chính cần không gian
        >
          {!isMobile && ( // Ẩn tiêu đề "Conversations" và trạng thái kết nối trên mobile khi sidebar đóng
            <HStack justifyContent="space-between" mb={4}>
              <Heading size="sm">Conversations</Heading>
              <Tooltip label={connectionStatus.text} hasArrow>
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={connectionStatus.color}
                />
              </Tooltip>
            </HStack>
          )}

          {isUser && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="sm"
              mb={4}
              onClick={createAdminChat}
              isDisabled={shouldDisableAdminChatBtn || isCreatingChat}
            >
              {isCreatingChat
                ? "Creating..."
                : shouldDisableAdminChatBtn
                ? "Admin Chat Exists"
                : "Chat with Admin"}
            </Button>
          )}

          <VStack spacing={2} align="stretch" flex="1" overflowY="auto">
            {loadingConversations ? (
              <Box textAlign="center" py={4}>
                <Spinner />
              </Box>
            ) : conversations.length > 0 ? (
              renderConversationList()
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                {isUser && !hasAdminChat
                  ? "Click 'Chat with Admin' to start"
                  : "No conversations yet"}
              </Text>
            )}
          </VStack>

          <Box mt={4} flexShrink={0}>
            <Heading size="xs" mb={2}>
              Online Users{" "}
              {userList.length > 0 && (
                <Badge colorScheme="green" borderRadius="full" px={2}>
                  {userList.length}
                </Badge>
              )}
            </Heading>
            {!isMobile && ( // Chỉ hiển thị danh sách user trên desktop
              <VStack
                spacing={1}
                align="stretch"
                maxH="150px"
                overflowY="auto"
                p={1}
                borderRadius="md"
                bg="white"
                border="1px solid"
                borderColor="gray.100"
              >
                {userList.length > 0 ? (
                  userList
                ) : (
                  <Text color="gray.500" textAlign="center" py={2}>
                    No users online
                  </Text>
                )}
              </VStack>
            )}
          </Box>
        </Box>
      )}

      {/* Chat Section */}
      {(!isSidebarOpen || !isMobile) && ( // Ẩn phần chat trên mobile nếu sidebar đang mở
        <Flex flex="1" direction="column" bg="white">
          {activeConversation && (
            <Box
              p={3}
              borderBottom="1px solid"
              borderColor="gray.200"
              flexShrink={0}
            >
              <HStack justifyContent="space-between" alignItems="center">
                {isMobile && ( // Nút quay lại sidebar trên mobile
                  <IconButton
                    aria-label="Back to conversations"
                    icon={<ChatIcon />}
                    size="sm"
                    onClick={() => setIsSidebarOpen(true)}
                    mr={2}
                  />
                )}
                <Heading size="sm">
                  {activeConversation.title ||
                    `Conversation ${activeConversation.id.slice(0, 8)}...`}
                </Heading>
                {/* Trạng thái kết nối có thể hiển thị ở đây trên mobile nếu muốn */}
                {isMobile && (
                  <Tooltip label={connectionStatus.text} hasArrow>
                    <Box
                      w={3}
                      h={3}
                      borderRadius="full"
                      bg={connectionStatus.color}
                    />
                  </Tooltip>
                )}
              </HStack>
            </Box>
          )}

          {!activeConversation ? (
            <Flex
              flex="1"
              align="center"
              justify="center"
              bg="gray.50"
              p={4}
              textAlign="center"
            >
              <VStack spacing={3}>
                <ChatIcon boxSize={10} color="gray.400" />
                <Text color="gray.500">
                  {isUser && !hasAdminChat
                    ? "Click 'Chat with Admin' to get support"
                    : "Select a conversation to start chatting"}
                </Text>
              </VStack>
            </Flex>
          ) : (
            <Box flex="1" overflowY="auto" p={4} bg="gray.50">
              {loadingMessages ? (
                <Flex justify="center" my={8}>
                  <Spinner />
                </Flex>
              ) : messages.length > 0 ? (
                <Flex direction="column">
                  {messageList}
                  <div ref={chatMessagesEndRef} /> {/* Sử dụng ref mới */}
                </Flex>
              ) : (
                <Text color="gray.500" textAlign="center" py={8}>
                  No messages yet. Start the conversation!
                </Text>
              )}
            </Box>
          )}

          <Box
            as="form"
            onSubmit={sendMessage}
            p={3}
            borderTop="1px solid"
            borderColor="gray.200"
            bg="white"
            flexShrink={0}
          >
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
                flex="1"
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
              <Button
                type="submit"
                colorScheme="blue"
                borderRadius="full"
                isDisabled={isSendButtonDisabled}
                minW="80px"
              >
                Gửi
              </Button>
            </HStack>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default ChatInterface;
