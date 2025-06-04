import { ChatIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, FormControl, HStack, Text, Textarea, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { getAppToken } from "../../configs/token";
import { useMutation } from "react-query";
import { submitReviewComment } from "../../services/customers/reviews";

export const ReviewComment = ({ comment, productId, reviewId, onCommentAdded, depth = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-collapse nếu độ sâu > 2
    const toast = useToast();
    const tokenApp = getAppToken();

    // Điều chỉnh màu nền theo độ sâu của comment
    const getCommentBg = () => {
        const bgOptions = [
            useColorModeValue("gray.50", "gray.700"),
            useColorModeValue("blue.50", "blue.900"),
            useColorModeValue("green.50", "green.900"),
            useColorModeValue("purple.50", "purple.900")
        ];
        return bgOptions[depth % bgOptions.length];
    };

    const bgComment = getCommentBg();
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // Tăng padding dựa vào độ sâu của comment
    const indentPadding = depth > 0 ? 6 : 0;

    const { mutate: sendComment, isLoading: isSendingComment } = useMutation(submitReviewComment, {
        onSuccess: () => {
            toast({ title: "Bình luận đã được gửi!", status: "success", duration: 3000, isClosable: true });
            setReplyContent("");
            setIsReplying(false);
            if (onCommentAdded) onCommentAdded();
        },
        onError: () => {
            toast({ title: "Lỗi khi gửi bình luận", status: "error", duration: 3000, isClosable: true });
        },
    });

    const handleSubmitReply = () => {
        if (!replyContent.trim()) {
            toast({ title: "Vui lòng nhập nội dung bình luận", status: "warning", duration: 3000, isClosable: true });
            return;
        }

        sendComment({
            reviewId: reviewId,
            comment: replyContent,
            parentCommentId: comment.id
        });
    };

    // Kiểm tra xem comment có replies hay không
    const hasReplies = comment.replies && comment.replies.length > 0;

    // Tính tổng số replies (bao gồm cả replies của replies)
    const countTotalReplies = (replies) => {
        if (!replies || replies.length === 0) return 0;

        let total = replies.length;
        for (const reply of replies) {
            if (reply.replies && reply.replies.length > 0) {
                total += countTotalReplies(reply.replies);
            }
        }
        return total;
    };

    const totalReplies = countTotalReplies(comment.replies);

    // Toggle collapse/expand
    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <Box my={2} pl={indentPadding}>
            <Box
                p={3}
                borderWidth="1px"
                borderRadius="md"
                bg={bgComment}
                borderColor={borderColor}
                borderLeftWidth={depth > 0 ? "3px" : "1px"}
                borderLeftColor={depth > 0 ? "teal.400" : borderColor}
            >
                <HStack spacing={3} align="start" mb={2}>
                    <Avatar size="sm" name={`User-${comment.id}`} />
                    <Box>
                        <Text fontWeight="medium">{comment?.userName}</Text>
                        <Text fontSize="sm" color="gray.500">
                            {new Date(comment.createdAt).toLocaleString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}

                        </Text>
                    </Box>
                </HStack>
                <Text ml={10}>{comment.content}</Text>

                {/* Hiển thị nút trả lời và nút mở rộng/thu gọn */}
                <HStack ml={10} mt={2} spacing={4}>
                    {tokenApp && (
                        <Button
                            leftIcon={<ChatIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            {isReplying ? "Hủy trả lời" : "Trả lời"}
                        </Button>
                    )}

                    {/* Hiển thị nút mở rộng/thu gọn nếu có replies */}
                    {hasReplies && (
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            onClick={toggleExpand}
                        >
                            {isExpanded ? "Thu gọn" : `Xem ${totalReplies} phản hồi`}
                        </Button>
                    )}
                </HStack>
            </Box>

            {/* Form trả lời */}
            {isReplying && (
                <Box mt={2} ml={10} p={3} borderWidth="1px" borderRadius="md">
                    <FormControl>
                        <Textarea
                            placeholder="Nhập câu trả lời..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            size="sm"
                        />
                    </FormControl>
                    <HStack mt={2} justifyContent="flex-end">
                        <Button size="sm" variant="outline" onClick={() => setIsReplying(false)}>
                            Hủy
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="teal"
                            isLoading={isSendingComment}
                            onClick={handleSubmitReply}
                        >
                            Gửi
                        </Button>
                    </HStack>
                </Box>
            )}

            {/* Hiển thị các trả lời một cách đệ quy khi isExpanded = true */}
            {hasReplies && isExpanded && (
                <VStack spacing={2} mt={2} align="stretch">
                    {comment.replies.map((reply) => (
                        <ReviewComment
                            key={reply.id}
                            comment={reply}
                            productId={productId}
                            reviewId={reviewId}
                            onCommentAdded={onCommentAdded}
                            depth={depth + 1} // Tăng độ sâu cho mỗi cấp con
                        />
                    ))}
                </VStack>
            )}

            {/* Hiển thị placeholder khi thu gọn để người dùng hiểu có nội dung bị ẩn */}
            {hasReplies && !isExpanded && (
                <Box
                    mt={2}
                    ml={10}
                    p={2}
                    borderLeftWidth="2px"
                    borderLeftColor="teal.400"
                    borderLeftStyle="solid"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                    onClick={toggleExpand}
                >
                    <Text fontSize="sm" color="gray.500">
                        {totalReplies} phản hồi đã được thu gọn. Nhấn để xem thêm...
                    </Text>
                </Box>
            )}
        </Box>
    );
};