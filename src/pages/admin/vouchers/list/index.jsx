import { Grid, GridItem, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter, Alert, AlertIcon } from "@chakra-ui/react"
import CoreInput from "../../../../components/atoms/CoreInput"
import CoreTable from "../../../../components/atoms/CoreTable"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { CloseIcon } from "@chakra-ui/icons"
import useListVouchers from "./useListVoucher"

const VoucherListAdmin = () => {
    const [{
        methodForm,
        columns,
        isLoading,
        openDialog,
        selectedProductName,
        dataTable,
        totalPages,
        pageNumber,
        pageSize,
    }, {
        handleCloseDialog,
        handleConfirmDelete,
        onChangePage,
        onChangePageSize,
        navigate
    }] = useListVouchers();

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
            <GridItem colSpan={12}>
                <Flex justifyContent="flex-end" mb={2}>
                    <Button variant="contained" onClick={() => {
                        navigate('/vouchers/add')
                    }}>
                        Thêm mới
                    </Button>
                </Flex>
            </GridItem>

            <GridItem colSpan={[12, 6, 3]}>
                <CoreInput
                    control={methodForm.control}
                    name='keyword'
                    label='Tìm kiếm'
                    placeholder='Nhập tên hoặc mã voucher'
                />
            </GridItem>

            <GridItem colSpan={12} mt={4}>
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
                        navigate(`/vouchers/detail/${id}`);
                    }}
                />
            </GridItem>

            <Modal isOpen={openDialog} onClose={handleCloseDialog} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Xác nhận xoá voucher</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Alert status="error" borderRadius="md" mb={4}>
                            <AlertIcon />
                            <Text fontWeight="bold" color="red.500">
                                Cảnh báo: Khi xóa, bạn sẽ không thể khôi phục voucher!
                            </Text>
                        </Alert>
                        <Text>Bạn có chắc chắn muốn xoá voucher <strong>{selectedProductName}</strong> này không?</Text>
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
            </Modal>

        </Grid>
    );
};

export default VoucherListAdmin;
