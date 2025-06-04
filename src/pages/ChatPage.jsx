import { Badge, Box, IconButton, useDisclosure } from "@chakra-ui/react";
import ChatInterface from "../components/chats";
import { FiMessageCircle } from "react-icons/fi";
import { useChatInterface } from "../Contexts/ChatContext";

export default function FloatingChatButton() {
    const { isOpen, onToggle } = useDisclosure();
    const [{ unreadCount }, { setUnreadCount }] = useChatInterface();

    const handleOpenChat = () => {
        onToggle();
        setUnreadCount(0);  // reset khi người dùng mở chat
    };

    return (
        <Box position="fixed" bottom="4" right="4" zIndex="popover">
            <Box position="relative">
                <IconButton
                    aria-label="Open chat"
                    icon={<FiMessageCircle />}
                    colorScheme="blue"
                    borderRadius="full"
                    boxShadow="lg"
                    onClick={handleOpenChat}
                />
                {unreadCount > 0 && (
                    <Badge
                        colorScheme="red"
                        borderRadius="full"
                        position="absolute"
                        top="-1"
                        right="-1"
                        fontSize="0.8em"
                        px={2}
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Box>
            {isOpen && (
                <Box
                    mt={2}
                    position="absolute"
                    bottom="60px"
                    right="0"
                    width={{ base: "1200px", md: "1000px" }}
                    bg="white"
                    boxShadow="2xl"
                    borderRadius="md"
                    overflow="hidden"
                >
                    <ChatInterface />
                </Box>
            )}
        </Box>

    );
}

