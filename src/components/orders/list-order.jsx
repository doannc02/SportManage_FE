import {
    Text,
    Container,
    Box,
    Flex,
    Button,
} from "@chakra-ui/react";
import useListOrders from "./use-list-orders";
import PropTypes from "prop-types";
import CoreTable from "../atoms/CoreTable";
import CoreInput from "../atoms/CoreInput";
import CoreSelectCustom from "../atoms/CoreAutoComplete";
import { OrderStateOptions } from "../../const/enum";
import StatusChangeDialog from "./state-change-dialog";


const ListOrder = ({
    userRole, // 'user' hoặc 'admin'
    title = "Danh sách đơn hàng",
    subtitle = "Quản lý và theo dõi các đơn hàng của bạn"
}) => {
    const [
        {
            methodForm,
            columns,
            isLoading,
            dataTable,
            totalPages,
            pageNumber,
            pageSize,
            // Dialog state
            isDialogOpen,
            selectedOrder,
            newStatus,
        },
        {
            onChangePage,
            onChangePageSize,
            navigate,
            onReset,
            // Dialog actions
            onStatusChange,
            onConfirmStatusChange,
            onCancelStatusChange,
        },
    ] = useListOrders({ role: userRole });

    return (
        <Container maxW="-moz-fit-content" pb={8}>
            {
                userRole === 'user' && <Box
                    bg="white"
                    boxShadow="md"
                    borderRadius="lg"
                    p={6}
                    mb={8}
                    textAlign="center"
                >
                    <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={2}>
                        {title}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                        {subtitle}
                    </Text>
                </Box>
            }

            <Box
                bg="white"
                boxShadow="sm"
                borderRadius="lg"
                px={16}
                py={10}
                mb={6}
            >
                <Flex mb={4} gap={4} justify="flex-start">
                    <Box w={["100%", "50%", "30%"]}>
                        <CoreInput
                            control={methodForm.control}
                            name="keyWord"
                            label="Tìm kiếm"
                            placeholder="Nhập tên hoặc mã đơn hàng"
                        />
                    </Box>
                    <Box w={["100%", "50%", "30%"]}>
                        <CoreSelectCustom
                            control={methodForm.control}
                            name="state"
                            label="Trạng thái đơn hàng"
                            options={OrderStateOptions}
                            placeholder="Chọn trạng thái đơn hàng"
                        />
                    </Box>
                    <Box w={["100%", "50%", "30%"]} display="flex" alignItems="end">
                        <Button onClick={onReset} colorScheme="gray" variant="outline">
                            Reset filter
                        </Button>
                    </Box>
                </Flex>

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
                        if (userRole === "admin") {
                            navigate(`/order-admin/detail/${id}`);
                        }else{
                         navigate(`/order/${id}`);   
                        }
                    }}
                />
            </Box>

            {/* Dialog xác nhận thay đổi trạng thái - chỉ hiển thị cho admin */}
            {userRole === 'admin' && (
                <StatusChangeDialog
                    isOpen={isDialogOpen}
                    onClose={onCancelStatusChange}
                    onConfirm={onConfirmStatusChange}
                    order={selectedOrder}
                    newStatus={newStatus}
                />
            )}
        </Container>
    );
};


ListOrder.propTypes = {
    userRole: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

export default ListOrder;