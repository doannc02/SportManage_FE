import { Box, Image, Text } from "@chakra-ui/react";
import { memo } from "react";
import { BASE_URL } from "../../../configs/auth";

const MessageList = ({ messages, token }) => {
    return messages.map((msg) => {
        const isSender = msg.senderId === token?.userId;
        const isImage = msg.messageType === "Image" || msg.messageType === 1;

        return (
            <Box
                key={msg.id}
                alignSelf={isSender ? "flex-end" : "flex-start"}
                mb={2}
                maxW="300px"
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
                            src={`${BASE_URL}${msg.content}`}
                            alt="Message image"
                            borderRadius="md"
                            objectFit="cover"
                            maxH="200px"
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
