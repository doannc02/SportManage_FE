import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text, VStack } from "@chakra-ui/react"

export const DialogProceessingPayment = ({ isProcessingPayment }) => {
    return <Modal isOpen={isProcessingPayment} onClose={() => { }} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
            <ModalBody p={8}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="teal.500" thickness="4px" />
                    <Text fontWeight="medium">Đang xử lý thanh toán...</Text>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                        Vui lòng không đóng trang này
                    </Text>
                </VStack>
            </ModalBody>
        </ModalContent>
    </Modal>
}