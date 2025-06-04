import { Button, Icon, VStack } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"
import { TbShoppingBag } from "react-icons/tb"

export const GroupButton = ({ navigate, isLoadingCreateOrder, onClick }) => {
    return <VStack spacing={3} mt={2}>
        <Button
            colorScheme="teal"
            size="lg"
            width={"100%"}
            isFullWidth
            height="40px"
            rightIcon={<Icon as={BiChevronRight} />}
            as={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            isLoading={isLoadingCreateOrder}
            onClick={onClick}
        >
            Thanh toán ngay
        </Button>

        <Button
            width={"100%"}
            variant="outline"
            colorScheme="teal"
            size="md"
            isFullWidth
            leftIcon={<Icon as={TbShoppingBag} />}
            onClick={() => navigate('/')}
        >
            Tiếp tục mua sắm
        </Button>
    </VStack>
}