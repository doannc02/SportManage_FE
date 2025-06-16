import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  useColorModeValue,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FaCheckCircle, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

const DialogConfirmPayment = ({
  isOpen,
  onClose,
  onConfirm,
  paymentMethod,
  totalAmount,
  isLoading,
}) => {
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const subtleColor = useColorModeValue("gray.50", "gray.700");

  const paymentMethodInfo = {
    COD: {
      icon: FaMoneyBillWave,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Bạn sẽ thanh toán khi nhận được hàng",
    },
    Momo: {
      icon: FaCreditCard,
      name: "Ví điện tử Momo",
      description: "Bạn sẽ được chuyển hướng đến trang thanh toán Momo",
    },
    ZaloPay: {
      icon: FaCreditCard,
      name: "Ví điện tử ZaloPay",
      description: "Bạn sẽ được chuyển hướng đến trang thanh toán ZaloPay",
    },
    // Thêm các phương thức khác nếu cần
  };

  const method = paymentMethodInfo[paymentMethod] || {
    icon: FaCreditCard,
    name: paymentMethod,
    description: `Thanh toán bằng ${paymentMethod}`,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Xác nhận thanh toán</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
            </Alert>

            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={subtleColor}
              borderColor="gray.200"
            >
              <Text fontWeight="bold" mb={2}>
                Phương thức thanh toán:
              </Text>
              <Flex align="center" mb={3}>
                <Icon as={method.icon} color={accentColor} mr={2} />
                <Text>{method.name}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.600">
                {method.description}
              </Text>
            </Box>

            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={subtleColor}
              borderColor="gray.200"
            >
              <Text fontWeight="bold" mb={2}>
                Tổng thanh toán:
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                {totalAmount.toLocaleString()} VND
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            colorScheme="teal"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Đang xử lý..."
            leftIcon={<FaCheckCircle />}
          >
            Xác nhận thanh toán
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DialogConfirmPayment;
