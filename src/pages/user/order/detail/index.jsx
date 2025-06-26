import { useEffect, useState } from "react";
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
  Download,
  ArrowLeft,
  Star,
  MessageCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCancelRequest,
  useQueryOrderDetail,
} from "../../../../services/customers/orders";
import {
  ORDER_STATES,
  paymentMethodEnums,
  paymentStatusEnums,
  TimelineStatusEnum,
} from "../../../../const/enum";
import OrderTimelineUser from "../../../../components/orders/order-timeline-user";
import OrderItemUser from "../../../../components/orders/order-items-user";
import { MdCancel } from "react-icons/md";
import { Spin } from "antd";
import CancelOrderDialog from "../../../../components/orders/cancel-order-dialog-user";
import { OrderLoadingContent } from "../../../../components/orders/order-loading-content";
import { useMutation } from "react-query";
import { addDays } from "../../../../helpers/date";

const SHIPPING_STATES = {
  Pending: {
    label: "Chờ lấy hàng",
    colorScheme: "yellow",
  },
  PickedUp: {
    label: "Đã lấy hàng",
    colorScheme: "blue",
  },
  InTransit: {
    label: "Đang vận chuyển",
    colorScheme: "blue",
  },
  OutForDelivery: {
    label: "Đang giao hàng",
    colorScheme: "orange",
  },
  Delivered: {
    label: "Đã giao thành công",
    colorScheme: "green",
  },
  Failed: {
    label: "Giao hàng thất bại",
    colorScheme: "red",
  },
  Returned: {
    label: "Đã trả lại",
    colorScheme: "gray",
  },
};

const OrderDetailUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [statusTimeline, setStatusTimeline] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const { data, isLoading, refetch } = useQueryOrderDetail({ id: id });
  const isCancelRequest = data?.state === "RequestCancel" ? true : false;
  const currentStatus = ORDER_STATES[data?.state];
  const currentShippingStatus = SHIPPING_STATES[data?.shippingStatus];
  const currentPaymentMethod = paymentMethodEnums.find(
    (method) => method.value === data?.payment?.method
  );
  const currentPaymentStatus = paymentStatusEnums.find(
    (status) => status.value === data?.payment?.status
  );
  const finalAmount =
    data?.subTotal - (data?.discountAmount ? data?.discountAmount : 0);

  const getTimeline = () => {
    const currentStatus = data?.state;

    let fullItems = TimelineStatusEnum.map((step) => {
      let timestamp = null;
      switch (step.status) {
        case "Pending":
          timestamp = data?.orderDate;
          break;
        case "Confirmed":
          timestamp = data?.confirmedDate;
          break;
        case "Processing":
          timestamp = data?.preparingDate;
          break;
        case "Shipped":
          timestamp = data?.shippedDate;
          break;
        case "Delivered":
          timestamp = data?.deliveredDate;
          break;
        case "RequestCancel":
          timestamp = data?.requestCancelDate;
          break;
        case "Canceled":
          timestamp = data?.canceledDate;
          break;
      }
      return { ...step, timestamp };
    });

    let filteredItems = [...fullItems];
    if (currentStatus === "Canceled" || currentStatus === "RequestCancel") {
      filteredItems = fullItems.filter(
        (step) => !["Shipped", "Delivered"].includes(step.status)
      );
    } else {
      filteredItems = fullItems.filter(
        (step) => !["RequestCancel", "Canceled"].includes(step.status)
      );
    }

    const currentIndex = filteredItems.findIndex(
      (step) => step.status === currentStatus
    );

    const updated = filteredItems.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
    }));

    setStatusTimeline(updated);
  };

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

  const handleRefreshOrder = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const { mutate: sendCancelRequest, isLoading: isLoadingCancelRequest } =
    useMutation(createCancelRequest, {
      onSuccess: () => {
        setOpenCancelDialog(false);
        toast({
          title: "Đã gửi yêu cầu hủy đơn hàng",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        refetch();
      },
      onError: (error) => {
        setOpenCancelDialog(false);
        toast({
          title: "Lỗi khi gửi yêu cầu hủy!",
          description: error?.response?.data?.message || "Có lỗi xảy ra",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
    });

  const handleConfirmCancel = async (payload) => {
    await sendCancelRequest(payload);
    setOpenCancelDialog(false);
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

  const handleCancelClick = () => {
    if (data?.state === "Processing") {
      toast({
        title: "Người bán đang chuẩn bị hàng nên không thể hủy",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (data?.state === "Shipped") {
      toast({
        title:
          "Đơn hàng của bạn đã được giao cho bên vận chuyển nên không thể hủy",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else {
      setOpenCancelDialog(true);
      return;
    }
  };
  useEffect(() => {
    getTimeline();
  }, [data?.state]);
  
  if (isLoading) {
    return <OrderLoadingContent />;
  }
  return (
    <>
      <Spin spinning={isLoading}>
        <Box minH="100vh" bg={bgColor}>
          {/* Header */}
          <Box bg={cardBg} borderBottom="1px" borderColor="gray.200">
            <Container maxW="7xl" py={6}>
              <Flex
                gap={3}
                flexDirection={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "left", md: "center" }}
              >
                <HStack spacing={4}>
                  <IconButton
                    icon={<ArrowLeft size={20} />}
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                  />
                  <Box>
                    <Heading size="lg" color="gray.900">
                      Chi tiết đơn hàng
                    </Heading>
                    <HStack spacing={2} mt={1}>
                      <Text color="gray.600">Mã đơn hàng:</Text>
                      <Text fontFamily="mono" fontWeight="medium">
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
                  </Box>
                </HStack>
                <HStack>
                  {data?.state === "Canceled" ||
                  data?.state === "Delivered" ? null : (
                    <>
                      <Button
                        leftIcon={<MdCancel size={16} />}
                        disabled={isCancelRequest}
                        variant="ghost"
                        bg={"red.50"}
                        color={"red.500"}
                        onClick={handleCancelClick}
                        isLoading={isRefreshing}
                        loadingText="Đang làm mới"
                      >
                        {isCancelRequest
                          ? "Yêu cầu hủy đã được gửi đi"
                          : "Yêu cầu huỷ đơn hàng"}
                      </Button>
                    </>
                  )}
                </HStack>
                <HStack spacing={3}>
                  <Button
                    leftIcon={<RefreshCw size={16} />}
                    bg={"gray.50"}
                    color={"gray.500"}
                    variant="ghost"
                    onClick={handleRefreshOrder}
                    isLoading={isRefreshing}
                    loadingText="Đang làm mới"
                  >
                    Làm mới
                  </Button>
                  <Button leftIcon={<Download size={16} />} colorScheme="teal">
                    Tải hóa đơn
                  </Button>
                </HStack>
              </Flex>
            </Container>
          </Box>

          <Container maxW="6xl" py={8}>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
              {/* Main content */}
              <GridItem>
                <VStack spacing={6} align="stretch">
                  {/* Order Status */}
                  <Card bg={cardBg}>
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Trạng thái đơn hàng</Heading>
                        <VStack spacing={2} align="end">
                          <Badge
                            colorScheme={currentStatus?.colorScheme}
                            variant="subtle"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            <HStack spacing={2}>
                              {currentStatus?.icon && (
                                <currentStatus.icon size={16} />
                              )}
                              <Text fontWeight="medium">
                                {currentStatus?.label}
                              </Text>
                            </HStack>
                          </Badge>

                          {/* Show shipping status if order is shipped */}
                          {data?.state === "Shipped" &&
                            currentShippingStatus && (
                              <Badge
                                colorScheme={currentShippingStatus?.colorScheme}
                                variant="outline"
                                px={2}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                              >
                                {currentShippingStatus?.label}
                              </Badge>
                            )}
                        </VStack>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <OrderTimelineUser
                        timeline={statusTimeline}
                        currentShippingStatus={data?.shippingStatus}
                        shippingHistories={data?.shippingHistories}
                      />

                      {data?.state === "Canceled" ? (
                        <>
                          <Alert status="info" mt={6} borderRadius="lg">
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
                        </>
                      ) : (
                        <>
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
                                  Đơn hàng sẽ được giao sau 7 ngày kể từ ngày
                                  đặt hàng.
                                </Text>

                                {/* Show carrier and shipper info if available */}
                                {data?.carrier && (
                                  <Text mt={2}>
                                    <Text as="span" fontWeight="medium">
                                      Đơn vị vận chuyển:
                                    </Text>{" "}
                                    {data?.carrier?.name}
                                  </Text>
                                )}
                                {data?.shipper && (
                                  <Text mt={1}>
                                    <Text as="span" fontWeight="medium">
                                      Shipper:
                                    </Text>{" "}
                                    {data?.shipper?.fullName} -{" "}
                                    {data?.shipper?.phoneNumber}
                                  </Text>
                                )}
                              </AlertDescription>
                            </Box>
                          </Alert>
                        </>
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
              </GridItem>

              {/* Sidebar */}
              <GridItem>
                <VStack spacing={6} align="stretch">
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

                  {/* Shipping Address */}
                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Địa chỉ giao hàng</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <HStack align="flex-start" spacing={3}>
                          <User size={20} color="gray" />
                          <Box>
                            <Text fontWeight="medium">
                              {data?.shippingAddress?.receiveName}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {data?.customer?.email ?? "example@gmail.com"}
                            </Text>
                          </Box>
                        </HStack>

                        <HStack align="flex-start" spacing={3}>
                          <Phone size={20} color="gray" />
                          <Text fontWeight="medium">
                            {data?.shippingAddress?.phone}
                          </Text>
                        </HStack>

                        <HStack align="flex-start" spacing={3}>
                          <MapPin size={20} color="gray" />
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            lineHeight="relaxed"
                          >
                            {data?.shippingAddress?.addressDetail}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Order Info */}
                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Thông tin đơn hàng</Heading>
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
            </Grid>
          </Container>
        </Box>

        <CancelOrderDialog
          isOpen={openCancelDialog}
          isLoading={isLoadingCancelRequest}
          onClose={() => setOpenCancelDialog(false)}
          order={data}
          onConfirm={handleConfirmCancel}
        />
      </Spin>
    </>
  );
};

export default OrderDetailUserPage;
