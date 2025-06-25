import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  Tag,
  Copy,
  Star,
  MessageCircle,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useQueryOrderDetail } from "../../../../services/customers/orders";
import {
  ORDER_STATES,
  paymentMethodEnums,
  paymentStatusEnums,
} from "../../../../const/enum";
import OrderItemUser from "../../../../components/orders/order-items-user";
import OrderTimelineAdmin from "../../../../components/orders/order-timeline-admin";
import LoadingOrderPageAdmin from "../../../../components/orders/loading-order-page-admin";

const OrderDetailAdminPage = () => {
  const { id } = useParams();
  const toast = useToast();


  const cardBg = useColorModeValue("white", "gray.800");

  const { data, isLoading } = useQueryOrderDetail({ id: id });
  const currentStatus = ORDER_STATES[data?.state];
  const currentPaymentMethod = paymentMethodEnums.find(
    (method) => method.value === data?.payment?.method
  );
  const currentPaymentStatus = paymentStatusEnums.find(
    (status) => status.value === data?.payment?.status
  );

  const finalAmount =
    data?.subTotal - (data?.discountAmount ? data?.discountAmount : 0);
  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(data?.id);
      toast({
        title: "Đã sao chép mã đơn hàng",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to copy order ID");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to add days to a date
  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
  };


  return (
    <>
      {isLoading ? (
        <LoadingOrderPageAdmin />
      ) : (
        <Box minH="100vh">
          {/* Header */}
          <Box bg={cardBg} borderBottom="1px" borderColor="gray.200">
            <Container maxW="9xl" py={4}>
              <HStack spacing={4}>
                <Box>
                  <HStack align="flex-start" spacing={3}>
                    <Heading size="lg" color="gray.900">
                      Thông tin giao hàng
                    </Heading>
                  </HStack>
                  <HStack align="flex-start" spacing={3}></HStack>

                  <HStack align="flex-start" spacing={3} mt={3}>
                    <QrCode size={20} color="gray" />
                    <Text
                      fontFamily="mono"
                      fontWeight="medium"
                      lineHeight="relaxed"
                    >
                      {data?.id}
                    </Text>
                    <IconButton
                      size="sm"
                      icon={<Copy size={16} />}
                      variant="ghost"
                      onClick={handleCopyOrderId}
                      aria-label="Copy order ID"
                    />
                  </HStack>
                  <HStack align="flex-start" spacing={3}>
                    <User size={20} color="gray" />
                    <Text fontWeight="medium">
                      {data?.shippingAddress?.receiveName}
                    </Text>
                  </HStack>

                  <HStack align="flex-start" spacing={3}>
                    <Phone size={20} color="gray" />
                    <Text fontWeight="medium">
                      {data?.shippingAddress?.phone}
                    </Text>
                  </HStack>

                  <HStack align="flex-start" spacing={3}>
                    <MapPin size={20} color="gray" />
                    <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
                      {data?.shippingAddress?.addressDetail}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            </Container>
          </Box>

          <Container maxW="9xl" py={8}>
            <VStack align="stretch">
              { /* Order Status */ }
              <Card>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Trạng thái đơn hàng</Heading>
                    <Badge
                      colorScheme={currentStatus?.colorScheme}
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      <HStack spacing={2}>
                        {currentStatus?.icon && <currentStatus.icon size={16} />}
                        <Text fontWeight="medium">{currentStatus?.label}</Text>
                      </HStack>
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <OrderTimelineAdmin />

                  {data?.state === "Canceled" ? (
                    <Alert status="error" mt={6} borderRadius="lg">
                      <AlertIcon as={AlertCircle} />
                      <Box>
                        <AlertTitle>Lý do đơn hàng bị hủy</AlertTitle>
                        <AlertDescription>
                          <Text>
                            {data?.reasonCancel ?? "Chưa rõ lý do hủy"}
                          </Text>
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ) : data?.state === "RequestCancel" ? (
                    <Alert status="warning" mt={6} borderRadius="lg">
                      <AlertIcon as={AlertCircle} />
                      <Box>
                        <AlertTitle>Lý do khách hàng yêu cầu hủy</AlertTitle>
                        <AlertDescription>
                          <Text>
                            {data?.reasonCancel ?? "Chưa rõ lý do hủy"}
                          </Text>
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ) : (
                    <Alert status="info" mt={6} borderRadius="lg">
                      <AlertIcon as={AlertCircle} />
                      <Box>
                        <AlertTitle>Thông tin giao hàng</AlertTitle>
                        <AlertDescription>
                          <Text>
                            Dự kiến giao hàng:{" "}
                            <Text as="span" fontWeight="bold">
                              {formatDate(
                                data?.expectedDeliveryDate ??
                                  addDays(data?.orderDate, 7)
                              )}
                            </Text>
                          </Text>
                          <Text mt={1}>
                            Đơn hàng sẽ được giao sau 7 ngày kể từ ngày đặt
                            hàng.
                          </Text>
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </CardBody>
              </Card>

              {/* Order Items */}
              <Card bg={cardBg}>
                <CardHeader borderBottom="1px" borderColor="gray.200">
                  <Heading size="md">Sản phẩm đã đặt</Heading>
                </CardHeader>
                <CardBody p={0}>
                  {data?.orderItems?.map((item) => (
                    <OrderItemUser key={item.id} item={item} />
                  ))}
                </CardBody>
              </Card>
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={2}>
                {/* Main content */}
                <GridItem>
                  <VStack align="stretch">
                    {/* Order Summary */}
                    <Card bg={cardBg}>
                      <CardHeader>
                        <Heading size="md">Tóm tắt đơn hàng</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3} align="stretch" fontSize="sm">
                          <Flex justify="space-between">
                            <Text color="gray.600">Tạm tính:</Text>
                            <Text>{data?.subTotal.toLocaleString()} VND</Text>
                          </Flex>

                          {data?.voucherCode && (
                            <Flex justify="space-between" color="green.600">
                              <HStack>
                                <Tag size={16} />
                                <Text>Mã giảm giá ({data?.voucherCode}):</Text>
                              </HStack>
                              <Text>
                                -{data?.discountAmount.toLocaleString()} VND
                              </Text>
                            </Flex>
                          )}

                          {/* <Flex justify="space-between">
                          <Text color="gray.600">Phí vận chuyển:</Text>
                          <Text>
                            {orderData?.shippingFee === 0
                              ? "Miễn phí"
                              : orderData?.shippingFee.toLocaleString() +
                                " VND"}
                          </Text>
                        </Flex> */}

                          <Divider />

                          <Flex
                            justify="space-between"
                            fontWeight="semibold"
                            fontSize="lg"
                          >
                            <Text>Tổng cộng:</Text>
                            <Text color="teal.600">
                              {finalAmount.toLocaleString()} VND
                            </Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                    {/* Order Info */}
                    <Card bg={cardBg}>
                      <CardHeader>
                        <Heading size="md">Mốc thời gian</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3} align="stretch" fontSize="sm">
                          <HStack spacing={3}>
                            <Calendar size={16} color="gray" />
                            <Box>
                              <Text color="gray.600">Ngày đặt hàng:</Text>
                              <Text fontWeight="medium">
                                {formatDate(data?.orderDate)}
                              </Text>
                            </Box>
                          </HStack>
                          {data?.state !== "Canceled" && (
                            <HStack spacing={3}>
                              <Clock size={16} color="gray" />
                              <Box>
                                <Text color="gray.600">Dự kiến giao hàng:</Text>
                                <Text fontWeight="medium">
                                  {formatDate(addDays(data?.orderDate, 7))}
                                </Text>
                              </Box>
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </GridItem>

                {/* Sidebar */}
                <GridItem>
                  <VStack spacing={6} align="stretch">
                    {/* Payment Information */}
                    <Card bg={cardBg}>
                      <CardHeader>
                        <Heading size="md">Thông tin thanh toán</Heading>
                      </CardHeader>
                      <CardBody>
                        <HStack spacing={3}>
                          {currentPaymentMethod?.icon ? (
                            <currentPaymentMethod.icon size={20} color="gray" />
                          ) : null}

                          <Box>
                            <Text fontWeight="medium">
                              {currentPaymentMethod?.label}
                            </Text>

                            <Text
                              fontSize="sm"
                              color={currentPaymentStatus?.color}
                            >
                              {currentPaymentStatus?.label}
                            </Text>
                          </Box>
                        </HStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </GridItem>
              </Grid>
              {/* Customer Actions */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Hành động</Heading>
                </CardHeader>
                <CardBody>
                  <Grid
                    templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                    gap={4}
                  >
                    <Button
                      leftIcon={<MessageCircle size={16} />}
                      variant="outline"
                    >
                      Liên hệ hỗ trợ
                    </Button>
                    <Button leftIcon={<Star size={16} />} variant="outline">
                      Đánh giá sản phẩm
                    </Button>
                  </Grid>
                </CardBody>
              </Card>
            </VStack>
          </Container>
        </Box>
      )}
    </>
  );
};

export default OrderDetailAdminPage;