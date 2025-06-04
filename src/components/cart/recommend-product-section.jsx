import { Badge, Box, Button, Card, Center, Heading, Icon, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { BiPlus } from "react-icons/bi"
import { FaGift } from "react-icons/fa"
import { TbShoppingBag } from "react-icons/tb"

const RecommendProductSection = () => {
    const accentColor = useColorModeValue("teal.500", "teal.300");
    return <Box mt={12}>
        <Heading size="md" mb={4} display="flex" alignItems="center">
            <Icon as={FaGift} mr={3} color={accentColor} />
            Có thể bạn cũng thích
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
            {/* This is just a mockup - in a real app, you'd fetch related products */}
            {[1, 2, 3, 4].map((item) => (
                <Card
                    key={item}
                    as={motion.div}
                    whileHover={{ y: -5, boxShadow: "lg" }}
                    cursor="pointer"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="sm"
                    transition="0.3s"
                >
                    <Box bg="gray.200" h="150px" position="relative">
                        <Center h="100%">
                            <Icon as={TbShoppingBag} boxSize={10} color="gray.400" />
                        </Center>
                        <Badge
                            position="absolute"
                            top={2}
                            right={2}
                            colorScheme="red"
                            variant="solid"
                            borderRadius="full"
                            px={2}
                            fontSize="xs"
                        >
                            -15%
                        </Badge>
                    </Box>
                    <Box p={3}>
                        <Text fontWeight="medium" noOfLines={1}>Sản phẩm gợi ý {item}</Text>
                        <Text color={accentColor} fontWeight="bold" mt={1}>
                            {(120000 * item).toLocaleString()} VND
                        </Text>
                        <Button
                            mt={2}
                            size="sm"
                            leftIcon={<BiPlus />}
                            colorScheme="teal"
                            variant="outline"
                            isFullWidth
                        >
                            Thêm vào giỏ
                        </Button>
                    </Box>
                </Card>
            ))}
        </SimpleGrid>
    </Box>
}

export default RecommendProductSection