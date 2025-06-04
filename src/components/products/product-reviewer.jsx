import { StarIcon } from "@chakra-ui/icons";
import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

const ReviewItem = ({ review, level = 0 }) => (
    <Box ml={level * 6} mt={4} p={4} borderWidth="1px" borderRadius="md">
        <HStack spacing={2}>
            <Avatar size="sm" name={review.userName} />
            <Text fontWeight="bold">{review.userName}</Text>
        </HStack>
        <Text mt={2} fontSize="sm">{review.comment}</Text>
        <HStack spacing={1} mt={1}>
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} color={i < review.rating ? "yellow.400" : "gray.300"} boxSize={4} />
            ))}
        </HStack>

        {review.children && review.children.length > 0 && (
            <VStack mt={4} spacing={2} align="start">
                {review.children.map((child) => (
                    <ReviewItem key={child.id} review={child} level={level + 1} />
                ))}
            </VStack>
        )}
    </Box>
);

export default ReviewItem