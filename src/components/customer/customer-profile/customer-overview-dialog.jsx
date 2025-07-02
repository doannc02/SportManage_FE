import React from "react";
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
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const CustomerOverviewDialog = (props) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    CustomerInformationForm,
    CustomerAddressForm,
  } = props;
  console.log("dialog re-render");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "md", md: "5xl" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="xl" fontWeight="bold" textAlign={"center"}>
            Cập nhật thông tin khách hàng
          </Text>
          <Text
            fontSize="sm"
            textAlign={"center"}
            fontStyle="italic"
            color="gray.500"
          >
            (*) Vui lòng điền đầy đủ thông tin trước khi gửi.
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Thông tin đơn hàng */}
            <Box>{CustomerInformationForm}</Box>

            <Divider />

            {/* Thay đổi trạng thái */}
            <Box>{CustomerAddressForm}</Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              colorScheme={"blue"}
              onClick={onConfirm}
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              loadingText="Đang cập nhật..."
            >
              Cập nhật
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

CustomerOverviewDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  isLoading: PropTypes.bool,
  CustomerInformationForm: PropTypes.node,
  CustomerAddressForm: PropTypes.node,
};

export default React.memo(CustomerOverviewDialog);
