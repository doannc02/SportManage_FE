import { Box, Divider, Flex, Skeleton, VStack } from "@chakra-ui/react"

export const LoadingSkeletonCart = () => {
    return <VStack spacing={0} divider={<Divider />} w="full">
        {[1, 2, 3].map(i => (
            <Box key={i} p={4} w="full">
                <Flex gap={4}>
                    <Skeleton height="80px" width="80px" />
                    <VStack align="start" flex="1">
                        <Skeleton height="20px" width="60%" />
                        <Skeleton height="16px" width="40%" />
                        <Skeleton height="24px" width="30%" />
                    </VStack>
                </Flex>
            </Box>
        ))}
    </VStack>
}
