import { Box, Image, Text } from "@chakra-ui/react";
import { memo } from "react";
import { BASE_URL } from "../../../configs/auth"; // Đảm bảo BASE_URL được import và sử dụng đúng cách

const MessageList = ({ messages, token }) => {
  return messages.map((msg) => {
    const isSender = msg.senderId === token?.userId;
    const isImage = msg.messageType === "Image" || msg.messageType === 1;

    return (
      <Box
        key={msg.id}
        alignSelf={isSender ? "flex-end" : "flex-start"}
        mb={2}
        maxW={{ base: "80%", md: "300px" }} // Tăng tính responsive cho maxW
        minW="20%" // Đảm bảo tin nhắn có chiều rộng tối thiểu
      >
        <Box
          bg={isSender ? "blue.400" : "gray.300"}
          color={isSender ? "white" : "black"}
          px={4}
          py={2}
          borderRadius="lg"
          wordBreak="break-word"
        >
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            {msg.senderName}
          </Text>

          {isImage ? (
            <Image
              src={`${BASE_URL}/${msg.content}`} // Đảm bảo sử dụng BASE_URL cho hình ảnh
              alt="Message image"
              borderRadius="md"
              objectFit="contain" // Thay cover bằng contain để ảnh không bị cắt xén
              maxH="200px"
              maxW="100%" // Đảm bảo ảnh không vượt quá chiều rộng của box
            />
          ) : (
            <Text>{msg.content || "[Empty message]"}</Text>
          )}

          {msg.failed && (
            <Text fontSize="xs" color="red.300" mt={1}>
              Failed to send
            </Text>
          )}
        </Box>
      </Box>
    );
  });
};

export default memo(MessageList);
