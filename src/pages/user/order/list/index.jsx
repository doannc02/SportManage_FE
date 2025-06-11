import {
    Text,
    Container,
    Box,
    Flex,
    Button,
} from "@chakra-ui/react";
import CoreTable from "../../../../components/atoms/CoreTable";
import useListOrders from "./use-list-order-user";
import CoreInput from "../../../../components/atoms/CoreInput";
import CoreSelectCustom from "../../../../components/atoms/CoreAutoComplete";

import { OrderStateOptions } from "../../../../const/enum";

const ListOrderUser = () => {
    const [
        {
            methodForm,
            columns,
            isLoading,
            dataTable,
            totalPages,
            pageNumber,
            pageSize,
        },
        {
            onChangePage,
            onChangePageSize,
            navigate,
            onReset,
        },
    ] = useListOrders();

    return (
        <Container maxW="-moz-fit-content" pb={8}>
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
                px={16}
                pb={10}
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
                            placeholder="Nhập tên hoặc mã đơn hàng"
                        />
                    </Box>
                    <Box w={["100%", "50%", "30%"]}>
                        <Button onClick={onReset}>
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
                        navigate(`/order/${id}`);
                    }}
                />
            </Box>
        </Container>
    );
};

export default ListOrderUser;
