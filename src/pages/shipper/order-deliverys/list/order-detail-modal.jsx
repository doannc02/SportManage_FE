import { Badge, Box, Button, Divider, Grid, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { ORDER_STATES } from "../../../../const/enum";
import { formatDate } from "../../../../helpers/date";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import PropTypes from "prop-types";

export const OrderDetailModal = ({ order, isOpen, onClose }) => {
    if (!order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack>
                        <Text>Chi tiết đơn hàng #{order.id.slice(-8)}</Text>
                        <Badge colorScheme={ORDER_STATES[order.state]?.color} variant="subtle">
                            {ORDER_STATES[order.state]?.label}
                        </Badge>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="stretch" spacing={4}>
                        {/* Customer Info */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Thông tin khách hàng</Text>
                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                <Box>
                                    <Text fontSize="sm" color="gray.600">Tên khách hàng</Text>
                                    <Text>{order.customerName}</Text>
                                </Box>
                                <Box>
                                    <Text fontSize="sm" color="gray.600">Ngày đặt</Text>
                                    <Text>{formatDate(order.orderDate)}</Text>
                                </Box>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* Shipping Address */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Địa chỉ giao hàng</Text>
                            <VStack align="start" spacing={1}>
                                <Text>{order.shippingAddress.receiveName}</Text>
                                <Text color="gray.600">{order.shippingAddress.phone}</Text>
                                <Text fontSize="sm" color="gray.500">{order.shippingAddress.addressDetail}</Text>
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Order Items */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Sản phẩm đặt hàng</Text>
                            <VStack align="stretch" spacing={2}>
                                {order.orderItems.map((item) => (
                                    <Box key={item.id} p={3} bg="gray.50" borderRadius="md">
                                        <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
                                            <Box>
                                                <Text fontWeight="medium">{item.productName}</Text>
                                            </Box>
                                            <Box textAlign="center">
                                                <Text fontSize="sm" color="gray.600">SL: {item.quantity}</Text>
                                            </Box>
                                            <Box textAlign="center">
                                                <Text fontSize="sm">{formatCurrency(item.unitPrice)}</Text>
                                            </Box>
                                            <Box textAlign="right">
                                                <Text fontWeight="medium">{formatCurrency(item.totalPrice)}</Text>
                                            </Box>
                                        </Grid>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Order Summary */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Tổng kết đơn hàng</Text>
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                    <Text>Tạm tính:</Text>
                                    <Text>{formatCurrency(order.subTotal)}</Text>
                                </HStack>
                                {order.discountAmount > 0 && (
                                    <HStack justify="space-between">
                                        <Text>Giảm giá ({order.voucherCode}):</Text>
                                        <Text color="red.500">-{formatCurrency(order.discountAmount)}</Text>
                                    </HStack>
                                )}
                                <Divider />
                                <HStack justify="space-between">
                                    <Text fontWeight="bold" fontSize="lg">Tổng cộng:</Text>
                                    <Text fontWeight="bold" fontSize="lg" color="green.500">
                                        {formatCurrency(order.total)}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>

                        {order.notes && (
                            <>
                                <Divider />
                                <Box>
                                    <Text fontWeight="bold" mb={2}>Ghi chú</Text>
                                    <Text fontSize="sm" color="gray.600">{order.notes}</Text>
                                </Box>
                            </>
                        )}
                    </VStack>
                    <VStack align="start" spacing={4}>
                        {order.confirmationPhotos?.length > 0 && (
                            <>
                                <Divider my={4} />
                                <Box>
                                    <Text fontWeight="bold" mb={2}>Ảnh xác nhận</Text>
                                    <SimpleGrid columns={2} spacing={4}>
                                        {order.confirmationPhotos.map((photo, index) => (
                                            <Box key={index} borderWidth="1px" borderRadius="lg" p={2}>
                                                <Image
                                                    src={photo.url}
                                                    alt={`Ảnh xác nhận ${index + 1}`}
                                                    borderRadius="md"
                                                />
                                                <Text fontSize="sm" color="gray.500" mt={2}>
                                                    {new Date(photo.timestamp).toLocaleString()}
                                                </Text>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                </Box>
                            </>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>Đóng</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

OrderDetailModal.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        customerName: PropTypes.string.isRequired,
        orderDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        shippingAddress: PropTypes.shape({
            receiveName: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            addressDetail: PropTypes.string.isRequired,
        }).isRequired,
        orderItems: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                productName: PropTypes.string.isRequired,
                quantity: PropTypes.number.isRequired,
                unitPrice: PropTypes.number.isRequired,
                totalPrice: PropTypes.number.isRequired,
            })
        ).isRequired,
        subTotal: PropTypes.number.isRequired,
        discountAmount: PropTypes.number,
        voucherCode: PropTypes.string,
        total: PropTypes.number.isRequired,
        notes: PropTypes.string,
        confirmationPhotos: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string.isRequired,
                timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
            })
        ),
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}; 