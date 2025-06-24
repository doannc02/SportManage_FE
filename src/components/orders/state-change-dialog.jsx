import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Divider,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import OrderStatusBadge from "./order-state-badge";
import PropTypes from "prop-types";

const StatusChangeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  newStatus,
  isLoading = false,
}) => {
  if (!order) return null;


  // Kiểm tra xem có phải là thay đổi hợp lệ không
  const isValidStatusChange = order.state !== newStatus;

  // Xác định mức độ nghiêm trọng của thay đổi
  const getChangeType = (from, to) => {
    if (to === "Canceled") return "critical";
    if (from === "Delivered" && to !== "Delivered") return "warning";
    return "normal";
  };

  const changeType = getChangeType(order.state, newStatus);

  const getAlertStatus = (type) => {
    switch (type) {
      case "critical":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  const getAlertMessage = (type) => {
    switch (type) {
      case "critical":
        return "Hành động này sẽ hủy đơn hàng và không thể hoàn tác!";
      case "warning":
        return 'Bạn đang thay đổi trạng thái từ "Đã giao" sang trạng thái khác. Hãy chắc chắn về quyết định này.';
      default:
        return "Trạng thái đơn hàng sẽ được cập nhật ngay lập tức.";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="lg" fontWeight="bold">
            Xác nhận thay đổi trạng thái
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Thông tin đơn hàng */}
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Thông tin đơn hàng:
              </Text>
              <Box bg="gray.50" p={3} borderRadius="md">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Mã đơn hàng:
                  </Text>
                  <Text fontSize="sm">{order.id}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="medium">
                    Khách hàng:
                  </Text>
                  <Text fontSize="sm">{order.customerName || "N/A"}</Text>
                </HStack>
              </Box>
            </Box>

            <Divider />

            {/* Thay đổi trạng thái */}
            <Box>
              <Text fontSize="sm" color="gray.600" mb={3}>
                Thay đổi trạng thái:
              </Text>
              <VStack spacing={2}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    Từ:
                  </Text>
                  <OrderStatusBadge status={order.state} size="sm" />
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    Sang:
                  </Text>
                  <OrderStatusBadge status={newStatus} size="sm" />
                </HStack>
              </VStack>
            </Box>

            {/* Cảnh báo */}
            {isValidStatusChange && (
              <Alert status={getAlertStatus(changeType)} borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">{getAlertMessage(changeType)}</Text>
              </Alert>
            )}

            {/* Trường hợp không hợp lệ */}
            {!isValidStatusChange && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  Trạng thái mới giống với trạng thái hiện tại.
                </Text>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              colorScheme={changeType === "critical" ? "red" : "blue"}
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={!isValidStatusChange}
              loadingText="Đang cập nhật..."
            >
              {changeType === "critical" ? "Xác nhận hủy" : "Xác nhận"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
StatusChangeDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object,
  newStatus: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default StatusChangeDialog;
