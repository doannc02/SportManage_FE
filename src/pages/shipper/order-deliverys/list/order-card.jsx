import { Badge, Box, Card, CardBody, Divider, Flex, Grid, GridItem, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure, VStack } from "@chakra-ui/react";
import CameraModal from '../../../../components/atoms/CoreCameraComponent';
import { ORDER_STATES } from "../../../../const/enum";
import { Calendar, DollarSign, Eye, MapPin, MoreVertical, Phone, User, Clock } from "lucide-react";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { formatDate } from "../../../../helpers/date";
import { useState } from "react";
import PropTypes from "prop-types";


export const OrderCard = ({ order, userRole, onViewDetails, onUpdateState }) => {
    const StateIcon = ORDER_STATES[order.state]?.icon || Clock;
    const [pendingAction, setPendingAction] = useState(null);

    const handleUpdateWithPhoto = (orderId, newState) => {
        setPendingAction({ orderId, newState });
        onCameraOpen();
    };

    const handlePhotoCaptured = (photo) => {
        // Send photo and update order state
        onUpdateState(pendingAction.orderId, pendingAction.newState, photo);
    };

    const {
        isOpen: isCameraOpen,
        onOpen: onCameraOpen,
        onClose: onCameraClose
    } = useDisclosure();

    return (
        <>
            <Card
                mb={4}
                shadow="md"
                _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                transition="all 0.2s"
                borderRadius="lg"
            >
                <CardBody p={{ base: 4, md: 6 }}>
                    {/* Mobile Layout */}
                    <Box display={{ base: "block", lg: "none" }}>
                        {/* Header: Order ID + Status */}
                        <Flex justify="space-between" align="center" mb={3}>
                            <Text fontWeight="bold" fontSize="lg">#{order.id.slice(-8)}</Text>
                            <Badge
                                colorScheme={ORDER_STATES[order.state]?.color}
                                variant="subtle"
                                p={2}
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <StateIcon size={14} />
                                {ORDER_STATES[order.state]?.label}
                            </Badge>
                        </Flex>

                        {/* Customer Info */}
                        <VStack align="start" spacing={2} mb={3}>
                            <HStack>
                                <User size={16} />
                                <Text fontSize="sm" color="gray.600">{order.customerName}</Text>
                            </HStack>
                            <HStack>
                                <Calendar size={16} />
                                <Text fontSize="xs" color="gray.500">{formatDate(order.orderDate)}</Text>
                            </HStack>
                        </VStack>

                        {/* Shipping Address */}
                        <Box mb={3} p={3} bg="gray.50" borderRadius="md">
                            <VStack align="start" spacing={2}>
                                <HStack>
                                    <MapPin size={16} />
                                    <Text fontSize="sm" fontWeight="medium">{order.shippingAddress.receiveName}</Text>
                                </HStack>
                                <HStack>
                                    <Phone size={16} />
                                    <Text fontSize="sm" color="gray.600">{order.shippingAddress.phone}</Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.600" lineHeight="1.4">
                                    {order.shippingAddress.addressDetail}
                                </Text>
                            </VStack>
                        </Box>

                        {/* Amount + Actions */}
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                                <HStack>
                                    <DollarSign size={16} color="green" />
                                    <Text fontWeight="bold" color="green.500" fontSize="lg">
                                        {formatCurrency(order.total)}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500">{order.orderItems.length} sản phẩm</Text>
                            </VStack>

                            <HStack spacing={2}>
                                <Tooltip label="Xem chi tiết">
                                    <IconButton
                                        icon={<Eye size={18} />}
                                        size="md"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => onViewDetails(order)}
                                    />
                                </Tooltip>

                                {(userRole === 'admin' || userRole === 'shipper') && (
                                    <Menu placement="top-end">
                                        <MenuButton
                                            as={IconButton}
                                            icon={<MoreVertical size={18} />}
                                            size="md"
                                            variant="ghost"
                                        />
                                        <MenuList zIndex="popover">
                                            {Object.entries(ORDER_STATES).map(([state, config]) => (
                                                <MenuItem
                                                    key={state}
                                                    onClick={() => {
                                                        if (['Pending', 'Delivered', 'Cancelled'].includes(state)) {
                                                            handleUpdateWithPhoto(order.id, state);
                                                        } else {
                                                            onUpdateState(order.id, state);
                                                        }
                                                    }}
                                                    isDisabled={order.state === state}
                                                >
                                                    <HStack>
                                                        <config.icon size={16} />
                                                        <Text>{config.label}</Text>
                                                    </HStack>
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Menu>
                                )}
                            </HStack>
                        </Flex>
                    </Box>

                    {/* Desktop Layout */}
                    <Box display={{ base: "none", lg: "block" }}>
                        <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="center">
                            {/* Order Info */}
                            <GridItem colSpan={3}>
                                <VStack align="start" spacing={2}>
                                    <Text fontWeight="bold" fontSize="lg">#{order.id.slice(-8)}</Text>
                                    <HStack>
                                        <User size={16} />
                                        <Text fontSize="sm" color="gray.600">{order.customerName}</Text>
                                    </HStack>
                                    <HStack>
                                        <Calendar size={16} />
                                        <Text fontSize="xs" color="gray.500">{formatDate(order.orderDate)}</Text>
                                    </HStack>
                                </VStack>
                            </GridItem>

                            {/* Status */}
                            <GridItem colSpan={2}>
                                <VStack align="center">
                                    <Badge
                                        colorScheme={ORDER_STATES[order.state]?.color}
                                        variant="subtle"
                                        p={2}
                                        borderRadius="md"
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <StateIcon size={14} />
                                        {ORDER_STATES[order.state]?.label}
                                    </Badge>
                                </VStack>
                            </GridItem>

                            {/* Address */}
                            <GridItem colSpan={3}>
                                <VStack align="start" spacing={1}>
                                    <HStack>
                                        <MapPin size={16} />
                                        <Text fontSize="sm" fontWeight="medium">{order.shippingAddress.receiveName}</Text>
                                    </HStack>
                                    <HStack>
                                        <Phone size={16} />
                                        <Text fontSize="sm" color="gray.600">{order.shippingAddress.phone}</Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500" noOfLines={2}>
                                        {order.shippingAddress.addressDetail}
                                    </Text>
                                </VStack>
                            </GridItem>

                            {/* Amount */}
                            <GridItem colSpan={2}>
                                <VStack align="center">
                                    <HStack>
                                        <DollarSign size={16} color="green" />
                                        <Text fontWeight="bold" color="green.500">{formatCurrency(order.total)}</Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">{order.orderItems.length} sản phẩm</Text>
                                </VStack>
                            </GridItem>

                            {/* Actions */}
                            <GridItem colSpan={2}>
                                <HStack justify="center" spacing={2}>
                                    <Tooltip label="Xem chi tiết">
                                        <IconButton
                                            icon={<Eye size={16} />}
                                            size="sm"
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => onViewDetails(order)}
                                        />
                                    </Tooltip>

                                    {(userRole === 'admin' || userRole === 'shipper') && (
                                        <Menu placement="right">
                                            <MenuButton
                                                as={IconButton}
                                                icon={<MoreVertical size={16} />}
                                                size="sm"
                                                variant="ghost"
                                            />
                                            <MenuList zIndex="popover">
                                                {Object.entries(ORDER_STATES).map(([state, config]) => (
                                                    <MenuItem
                                                        key={state}
                                                        onClick={() => {
                                                            if (['shipped', 'delivered', 'cancelled'].includes(state)) {
                                                                handleUpdateWithPhoto(order.id, state);
                                                            } else {
                                                                onUpdateState(order.id, state);
                                                            }
                                                        }}
                                                        isDisabled={order.state === state}
                                                    >
                                                        <HStack>
                                                            <config.icon size={16} />
                                                            <Text>{config.label}</Text>
                                                        </HStack>
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    )}
                                </HStack>
                            </GridItem>
                        </Grid>
                    </Box>

                    {/* Notes Section - Both layouts */}
                    {order.notes && (
                        <>
                            <Divider my={3} />
                            <Box>
                                <HStack align="start" spacing={2}>
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium" minW="fit-content">
                                        Ghi chú:
                                    </Text>
                                    <Text fontSize="sm" color="gray.700" lineHeight="1.4">
                                        {order.notes}
                                    </Text>
                                </HStack>
                            </Box>
                        </>
                    )}
                </CardBody>
            </Card>

            <CameraModal
                isOpen={isCameraOpen}
                onClose={onCameraClose}
                onCapture={handlePhotoCaptured}
            />
        </>
    );
};


OrderCard.propTypes = {
    order: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    onViewDetails: PropTypes.func.isRequired,
    onUpdateState: PropTypes.func.isRequired,
};
