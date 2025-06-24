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
import PropTypes from "prop-types";
import CoreAutoComplete from "../atoms/CoreAutoComplete";
import { useForm } from "react-hook-form";
import {  optionsRejectReason } from "../../const/enum";
import React, { useEffect } from "react";
import { formatOffsetDateTime } from "../../helpers/date";
import CoreInput from "../atoms/CoreInput";

const RejectCancelOrderDialog = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  isLoading = false,
}) => {
  const methodForm = useForm({
    defaultValues: {
      orderId: "",
      reason: "already_shipped",
      date: formatOffsetDateTime(Date.now()),
      detailReason: "",
    },
  });
  const { control, reset, handleSubmit } = methodForm;

  useEffect(() => {
    if (order) {
      reset({
        orderId: order.id,
        reason: "already_shipped",
        date: formatOffsetDateTime(Date.now()),
        detailReason: "",
      });
    }
  }, [order, reset]);

  const handleConfirm = handleSubmit(async (data) => {
    onConfirm(data);
  });

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "xs", sm: "md", md: "lg", lg: "xl" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        mx={{ base: 2, sm: 4 }} // margin x responsive
        w="full"
        maxW={{ base: "95vw", sm: "90vw", md: "600px", lg: "800px" }}
      >
        <ModalHeader>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
            Chọn lý do từ chối hủy
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Thông tin đơn hàng */}
            <Box>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={2}>
                Thông tin đơn hàng:
              </Text>
              <Box bg="gray.50" p={3} borderRadius="md">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                    Mã đơn hàng:
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>{order.id}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                    Khách hàng:
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    {order.customerName || "N/A"}
                  </Text>
                </HStack>
              </Box>
            </Box>

            <Divider />

            {/* Lý do hủy */}
            <CoreAutoComplete
              control={control}
              name="reason"
              label="Lý do từ chối"
              options={optionsRejectReason}
              placeholder="Chọn lý do từ chối hủy"
            />
            <CoreInput
              control={control}
              name="detailReason"
              label="Chi tiết"
              placeholder="Nhập chi tiết lý do từ chối"
              multiline
            />
            {/* Cảnh báo */}
            <Alert status={"info"} borderRadius="md">
              <AlertIcon />
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Trạng thái đơn hàng sẽ được cập nhật ngay lập tức.
              </Text>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              colorScheme={"blue"}
              onClick={handleConfirm}
              isLoading={isLoading}
              disabled={isLoading}
              loadingText="Đang cập nhật..."
            >
              Xác nhận
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
RejectCancelOrderDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default React.memo(RejectCancelOrderDialog);
