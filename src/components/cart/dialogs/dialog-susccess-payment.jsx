import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Flex, Icon, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useColorModeValue } from "@chakra-ui/react"
import { FaCreditCard } from "react-icons/fa"

export const DialogSuccessPayment = ({ isPaymentSuccessOpen, isAutoCreatingOrder, cartTotal, voucherDiscount, selectedVoucher }) => {
    return <Modal isOpen={isPaymentSuccessOpen} onClose={() => { }} isCentered size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
            <ModalHeader>
                <Flex align="center">
                    <Icon as={FaCreditCard} color="green.500" mr={2} />
                    Thanh toán thành công
                </Flex>
            </ModalHeader>
            <ModalBody>
                <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Giao dịch thành công!</AlertTitle>
                        <AlertDescription>
                            Thanh toán bằng thẻ của bạn đã được xử lý thành công.
                            {isAutoCreatingOrder ?
                                "Đang tạo đơn hàng..." :
                                "Đơn hàng sẽ được tạo tự động."
                            }
                        </AlertDescription>
                    </Box>
                </Alert>
                <Box mt={4} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                        <strong>Số tiền thanh toán:</strong> {(cartTotal - voucherDiscount).toLocaleString()} VND
                    </Text>
                    {selectedVoucher && (
                        <Text fontSize="sm" color="gray.600" mt={1}>
                            <strong>Mã giảm giá:</strong> {selectedVoucher.code} (-{voucherDiscount.toLocaleString()} VND)
                        </Text>
                    )}
                </Box>
                {isAutoCreatingOrder && (
                    <Flex align="center" justify="center" mt={4} p={3} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="md">
                        <Spinner size="sm" color="blue.500" mr={2} />
                        <Text fontSize="sm" color="blue.600">
                            Đang tạo đơn hàng...
                        </Text>
                    </Flex>
                )}
            </ModalBody>
        </ModalContent>
    </Modal>
}