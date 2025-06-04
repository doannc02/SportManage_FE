import { Card, Flex, Icon, SimpleGrid, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { MdLocalShipping, MdSecurity } from "react-icons/md"
import { TbDiscount } from "react-icons/tb"

const ShippingAndPaymentInfo = () => {
    const subtleColor = useColorModeValue("gray.50", "gray.700");
    return <SimpleGrid columns={3} spacing={6} mt={2}>
        <Card p={3} bg={subtleColor} borderRadius="md">
            <VStack align="start" spacing={1}>
                <Flex align="center">
                    <Icon as={MdLocalShipping} color="blue.500" mr={1} />
                    <Text fontSize="sm" fontWeight="medium">Giao hàng</Text>
                </Flex>
                <Text fontSize="xs" color="gray.500">Nhận hàng trong 1-3 ngày</Text>
            </VStack>
        </Card>
        <Card p={3} bg={subtleColor} borderRadius="md">
            <VStack align="start" spacing={1}>
                <Flex align="center">
                    <Icon as={TbDiscount} color="purple.500" mr={1} />
                    <Text fontSize="sm" fontWeight="medium">Đổi trả</Text>
                </Flex>
                <Text fontSize="xs" color="gray.500">Miễn phí trong 7 ngày</Text>
            </VStack>
        </Card>
        <Card p={3} bg={subtleColor} borderRadius="md">
            <VStack align="start" spacing={1}>
                <Flex align="center">
                    <Icon as={MdSecurity} color="purple.500" mr={1} />
                    <Text fontSize="sm" fontWeight="medium">Bảo hành</Text>
                </Flex>
                <Text fontSize="xs" color="gray.500">Bảo hành chính hãng toàn quốc</Text>
            </VStack>
        </Card>
    </SimpleGrid>
}

export default ShippingAndPaymentInfo