import { Button, Center, Icon, Text } from "@chakra-ui/react"
import { FaShoppingCart } from "react-icons/fa"
import { TbShoppingBag } from "react-icons/tb"

export const ItemCartEmpty = ({ navigate }) => {
    return <Center p={12} flexDirection="column" textAlign="center">
        <Icon as={FaShoppingCart} boxSize={16} color="gray.300" mb={4} />
        <Text fontSize="lg" fontWeight="medium" mb={2}>Giỏ hàng trống</Text>
        <Text color="gray.500" mb={6}>Chưa có sản phẩm nào trong giỏ hàng của bạn</Text>
        <Button
            colorScheme="teal"
            leftIcon={<TbShoppingBag />}
            onClick={() => {
                navigate('/')
            }}
        >
            Tiếp tục mua sắm
        </Button>
    </Center>
}