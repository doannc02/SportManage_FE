import { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Card,
    CardBody,
    Flex,
    Grid,
    useDisclosure,
    useToast,
    Skeleton,
    Container,
    Switch,
    FormControl,
    FormLabel,
    Stat,
    StatLabel,
    StatNumber,
} from '@chakra-ui/react';
import {
    Package,
    RefreshCw
} from 'lucide-react';
import { OrderDetailModal } from './order-detail-modal';
import { OrderCard } from './order-card';
import { OrderFilters } from './order-filters';

const useUpdateOrderState = () => {
    const toast = useToast();

    const mutate = async ({ orderId, newState }) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Cập nhật thành công",
            description: `Đơn hàng ${orderId} đã được cập nhật trạng thái`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return { mutate, isLoading: false };
};


const OrderStats = ({ orders }) => {
    const stats = orders?.reduce((acc, order) => {
        acc.total += 1;
        acc.totalAmount += order.total;
        acc.byState[order.state] = (acc.byState[order.state] || 0) + 1;
        return acc;
    }, { total: 0, totalAmount: 0, byState: {} }) || { total: 0, totalAmount: 0, byState: {} };

    return (
        <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }} gap={4} mb={6}>
            <Card>
                <CardBody textAlign="center">
                    <Stat>
                        <StatLabel>Tổng đơn hàng</StatLabel>
                        <StatNumber>{stats.total}</StatNumber>
                    </Stat>
                </CardBody>
            </Card>

            <Card>
                <CardBody textAlign="center">
                    <Stat>
                        <StatLabel>Tổng doanh thu</StatLabel>
                        <StatNumber fontSize="md">{formatCurrency(stats.totalAmount)}</StatNumber>
                    </Stat>
                </CardBody>
            </Card>

            {Object.entries(ORDER_STATES).slice(0, 3).map(([key, config]) => (
                <Card key={key}>
                    <CardBody textAlign="center">
                        <Stat>
                            <StatLabel>{config.label}</StatLabel>
                            <StatNumber color={`${config.color}.500`}>
                                {stats.byState[key] || 0}
                            </StatNumber>
                        </Stat>
                    </CardBody>
                </Card>
            ))}
        </Grid>
    );
};

import PropTypes from 'prop-types';
import { ORDER_STATES } from '../../../../const/enum';
import { formatCurrency } from '../../../../helpers/formatCurrency';
import { useQueryOrdersPagingAdmin } from '../../../../services/admins/orders';

OrderStats.propTypes = {
    orders: PropTypes.array
};

const OrderManagementDashboard = () => {
    const [userRole, setUserRole] = useState('shipper'); // admin, shipper
    const [filters, setFilters] = useState({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: '',
        state: '',
        fromDate: '',
        toDate: '',
        customerId: ''
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    //const { data: ordersData, isLoading, error, refetch } = useOrdersQuery(filters);
    const { data: ordersData, isLoading, error, refetch } = useQueryOrdersPagingAdmin({
        ...filters,
    })
    const updateOrderMutation = useUpdateOrderState();

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        onOpen();
    };

    const handleUpdateState = async (orderId, newState) => {
        await updateOrderMutation.mutate({ orderId, newState });
        refetch();
    };

    const handleResetFilters = () => {
        setFilters({
            pageNumber: 1,
            pageSize: 10,
            searchTerm: '',
            state: '',
            fromDate: '',
            toDate: '',
            customerId: ''
        });
    };

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text color="red.500">Có lỗi xảy ra khi tải dữ liệu</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={3}>
            <VStack align="stretch" spacing={6}>
                {/* Header */}
                <Flex justify="space-between" align="center">
                    <Box>
                        <Text color="gray.600">
                            {userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên giao hàng'}
                        </Text>
                    </Box>

                    <HStack>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="role-switch" mb="0" fontSize="sm">
                                Chế độ Admin
                            </FormLabel>
                            <Switch
                                id="role-switch"
                                isChecked={userRole === 'admin'}
                                onChange={(e) => setUserRole(e.target.checked ? 'admin' : 'shipper')}
                            />
                        </FormControl>

                        <Button leftIcon={<RefreshCw size={16} />} onClick={refetch} isLoading={isLoading}>
                            Làm mới
                        </Button>
                    </HStack>
                </Flex>

                {/* Stats */}
                {!isLoading && ordersData?.items && (
                    <OrderStats orders={ordersData.items} />
                )}

                {/* Filters */}
                <OrderFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onReset={handleResetFilters}
                />

                {/* Orders List */}
                <Box>
                    {isLoading ? (
                        <VStack spacing={2}>
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} height="120px" w="100%" />
                            ))}
                        </VStack>
                    ) : (
                        <VStack align="stretch" spacing={4}>
                            {ordersData?.items?.length === 0 ? (
                                <Card>
                                    <CardBody textAlign="center" py={8}>
                                        <Package size={48} color="gray" />
                                        <Text mt={4} color="gray.500">Không có đơn hàng nào</Text>
                                    </CardBody>
                                </Card>
                            ) : (
                                ordersData?.items?.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        userRole={userRole}
                                        onViewDetails={handleViewDetails}
                                        onUpdateState={handleUpdateState}
                                    />
                                ))
                            )}
                        </VStack>
                    )}
                </Box>

                {/* Order Detail Modal */}
                <OrderDetailModal
                    order={selectedOrder}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            </VStack>
        </Container>
    );
};

export default OrderManagementDashboard;