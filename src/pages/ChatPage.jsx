import { Badge, Box, IconButton, useDisclosure } from "@chakra-ui/react";
import ChatInterface from "../components/chats";
import { FiMessageCircle } from "react-icons/fi";
import { useChatInterface } from "../Contexts/ChatContext";
import { useEffect, useRef } from "react"; // Import useEffect and useRef

export default function FloatingChatButton() {
  const { isOpen, onToggle, onClose } = useDisclosure(); // Get onClose from useDisclosure
  const [{ unreadCount }, { setUnreadCount }] = useChatInterface();

  // Create a ref for the chat container
  const chatRef = useRef(null);
  // Create a ref for the chat button
  const buttonRef = useRef(null);

  const handleOpenChat = () => {
    onToggle();
    setUnreadCount(0); // reset khi người dùng mở chat
  };

  // Effect to handle clicks outside the chat form
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the chat form is open AND
      // the click is not inside the chat container AND
      // the click is not on the chat button itself
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose(); // Close the chat form
      }
    };

    // Add event listener when the component mounts or isOpen changes
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]); // Depend on isOpen and onClose to re-run the effect

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="popover">
      <Box position="relative">
        <IconButton
          ref={buttonRef} // Assign the ref to the button
          aria-label="Open chat"
          icon={<FiMessageCircle />}
          colorScheme="blue"
          borderRadius="full"
          boxShadow="lg"
          onClick={handleOpenChat}
          size="lg" // Larger button for easier tapping on mobile
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
            py={0.5} // Added a bit of vertical padding
          >
            {unreadCount}
          </Badge>
        )}
      </Box>
      {isOpen && (
        <Box
          ref={chatRef} // Assign the ref to the chat container
          mt={2}
          position="absolute"
          bottom="60px" // Adjusted slightly to give more space from button
          right="0"
          // Responsive width: 95% on small, 700px on medium, 1000px on large screens
          width={{ base: "95vw", sm: "600px", md: "700px", lg: "1000px" }}
          height={{ base: "70vh", md: "80vh" }} // Responsive height
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
