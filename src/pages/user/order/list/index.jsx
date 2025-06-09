import {
  Grid,
  GridItem,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Alert,
  AlertIcon,
  Container,
  Box,
} from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import CoreTable from "../../../../components/atoms/CoreTable";
import { Button } from "@mui/material";
import { CloseIcon } from "@chakra-ui/icons";
import useListVouchers from "../../../admin/vouchers/list/useListVoucher";
import { useUserOrderList } from "../../../../services/customers/orders";
import useListOrders from "./useListOrders";

const UserOrderList = () => {
  const [
    {
      methodForm,
      columns,
      isLoading,
      openDialog,
      selectedProductName,
      dataTable,
      totalPages,
      pageNumber,
      pageSize,
    },
    {
      handleCloseDialog,
      handleConfirmDelete,
      onChangePage,
      onChangePageSize,
      navigate,
    },
  ] = useListOrders();
//   const { data } = useUserOrderList({
//     pageNumber: 0,
//     pageSize: 20,
//     // keyWord: "",
//   });
//   console.log(data);

return (
    <Container maxW="container.xl" py={8}>
        <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            p={6}
            mb={8}
            textAlign="center"
        >
            <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={2}>
                Danh sách đơn hàng
            </Text>
            <Text fontSize="md" color="gray.500">
                Quản lý và theo dõi các đơn hàng của bạn
            </Text>
        </Box>
        <Box
            bg="white"
            boxShadow="sm"
            borderRadius="lg"
            mb={6}
        >
            {/* <Flex mb={4} justify="flex-end">
                <Box w={["100%", "50%", "30%"]}>
                    <CoreInput
                        control={methodForm.control}
                        name="keyword"
                        label="Tìm kiếm"
                        placeholder="Nhập tên hoặc mã đơn hàng"
                    />
                </Box>
            </Flex> */}
            <CoreTable
                onChangePage={onChangePage}
                columns={columns}
                paginationHidden={dataTable.length < 1}
                data={dataTable}
                onChangePageSize={onChangePageSize}
                totalPages={totalPages}
                page={pageNumber}
                size={pageSize}
                isLoading={isLoading}
                onRowClick={(id) => {
                    navigate(`/order/${id}`);
                }}
            />
        </Box>
        {/* <Modal isOpen={openDialog} onClose={handleCloseDialog} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius="lg">
                <ModalHeader color="red.500" fontWeight="bold">
                    Xác nhận xoá voucher
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Alert status="error" borderRadius="md" mb={4}>
                        <AlertIcon />
                        <Text fontWeight="bold" color="red.500">
                            Cảnh báo: Khi xóa, bạn sẽ không thể khôi phục voucher!
                        </Text>
                    </Alert>
                    <Text>
                        Bạn có chắc chắn muốn xoá voucher{" "}
                        <Text as="span" fontWeight="bold" color="teal.600">
                            {selectedProductName}
                        </Text>{" "}
                        này không?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseDialog} variant="outline" mr={3}>
                        Huỷ
                    </Button>
                    <Button colorScheme="red" onClick={handleConfirmDelete}>
                        Xoá
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal> */}
    </Container>
);
};

export default UserOrderList;
