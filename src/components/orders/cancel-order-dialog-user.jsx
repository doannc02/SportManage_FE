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
import { optionsReason } from "../../const/enum";
import React, { useEffect } from "react";
import { formatOffsetDateTime } from "../../helpers/date";
import CoreInput from "../atoms/CoreInput";

const CancelOrderDialog = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  isLoading = false,
}) => {
  const methodForm = useForm({
    defaultValues: {
      orderId: "",
      reason: "not_need",
      date: formatOffsetDateTime(Date.now()),
      detailReason: "",
    },
  });
  const { control, reset, getValues } = methodForm;

  useEffect(() => {
    if (order) {
      reset({
        orderId: order.id,
        reason: "not_need",
        date: formatOffsetDateTime(Date.now()),
        detailReason: "",
      });
    }
  }, [order, reset]);

  const handleConfirm = () => {
    const formData = getValues();
    onConfirm(formData); // gửi toàn bộ form lên
  };

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
            Xác nhận hủy đơn hàng này
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
              label="Lý do hủy"
              options={optionsReason}
              placeholder="Chọn lý do hủy đơn hàng"
            />
            <CoreInput
              control={control}
              name="detailReason"
              label="Chi tiết"
              placeholder="Nhập chi tiết lý do hủy"
              multiline
            />
            {/* Cảnh báo */}
            <Alert status={"error"} borderRadius="md">
              <AlertIcon />
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Hành động này sẽ hủy đơn hàng và không thể hoàn tác!
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
              colorScheme={"red"}
              onClick={handleConfirm}
              isLoading={isLoading}
              disabled={isLoading}
              loadingText="Đang cập nhật..."
            >
              Xác nhận hủy
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
CancelOrderDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default React.memo(CancelOrderDialog);
