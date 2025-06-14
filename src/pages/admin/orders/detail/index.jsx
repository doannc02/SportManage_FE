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
  Icon,
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
import CoreLoading from "../../../../components/atoms/CoreLoading";
import {
  ORDER_STATES,
  paymentMethodEnums,
  paymentStatusEnums,
  TimelineStatusEnum,
} from "../../../../const/enum";
import OrderItemUser from "../../../../components/orders/order-items-user";
import OrderTimelineAdmin from "../../../../components/orders/order-timeline-admin";
import { convertNumberToWords } from "../../../../helpers/convert-num-to-text";
import { FiCreditCard } from "react-icons/fi";

const OrderDetailAdminPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [statusTimeline, setStatusTimeline] = useState([]);

  const cardBg = useColorModeValue("white", "gray.800");

  const { data, isLoading } = useQueryOrderDetail({ id: id });
  const currentStatus = ORDER_STATES[data?.state];
  const currentPaymentMethod = paymentMethodEnums.find(
    (method) => method.value === data?.payment?.method
  );
  const currentPaymentStatus = paymentStatusEnums.find(
    (status) => status.value === data?.payment?.status
  );
  const getTimeline = () => {
    let items = [];
    let currentStatus = data?.state;
    let isCompleted = true;
    for (const statusDraff of TimelineStatusEnum) {
      items.push({
        ...statusDraff,
      });
    }
    if (currentStatus === "Canceled") {
      const canceledStep = items.find((step) => step.status === "Canceled");
      if (canceledStep) {
        canceledStep.completed = isCompleted;
        setStatusTimeline([canceledStep]);
      } else {
        setStatusTimeline([]);
      }
      return;
    }
    if (currentStatus !== "Canceled") {
      items = items.filter((obj) => obj?.status !== "Canceled");
    }
    // Gán lại biến timestamp vào từng bước trong TimelineStatusEnum
    items = items.map((step) => {
      let timestamp = null;
      switch (step.status) {
        case "Pending":
          timestamp = data?.orderDate;
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
        case "Canceled":
          timestamp = data?.canceledDate;
          break;
        default:
          break;
      }
      return { ...step, timestamp };
    });
    // Tìm vị trí (index) của trạng thái hiện tại
    const currentIndex = items.findIndex(
      (step) => step.status === currentStatus
    );

    // Tạo danh sách các bước timeline, đánh dấu completed = true nếu nằm trước hoặc tại trạng thái hiện tại
    const updatedSteps = items.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
    }));
    setStatusTimeline(updatedSteps);
  };

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
  useEffect(() => {
    getTimeline();
  }, [data?.state]);

  return (
    <>
      {isLoading ? (
        <CoreLoading />
      ) : (
        <Box minH="100vh">
          {/* Header */}
          <Box bg={cardBg} borderBottom="1px" borderColor="gray.200">
            <Container maxW="9xl" py={4}>
              <HStack spacing={4}>
                <Box flex={1}>
                  <HStack align="flex-start" spacing={3}>
                    <Heading size="lg" color="gray.900">
                      Thông tin chi tiết đơn hàng
                    </Heading>
                  </HStack>

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

                  <Grid
                    templateColumns={{ base: "1fr", lg: "2fr auto 1fr" }}
                    gap={6}
                    mt={4}
                  >
                    {/* Customer Info */}
                    <GridItem>
                      <VStack align="flex-start" spacing={3}>
                        <HStack align="flex-start" spacing={3}>
                          <User size={20} color="gray" />
                          <Box
                            p={2}
                            borderRadius="md"
                            bg="gray.50"
                            borderLeft="4px solid"
                            borderColor="purple.500"
                          >
                            <Text fontWeight="bold">
                              Tên khách hàng:{" "}
                              <Text as="span" color="purple.600">
                                {data?.customerName}
                              </Text>{" "}
                              - Tên người nhận:{" "}
                              <Text as="span" color="purple.600">
                                {data?.shippingAddress?.receiveName}
                              </Text>
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
                    </GridItem>

                    {/* Divider */}
                    <GridItem
                      display={{ base: "none", lg: "flex" }}
                      alignItems="center"
                    >
                      <Divider
                        orientation="vertical"
                        h="80px"
                        borderColor="gray.300"
                      />
                    </GridItem>

                    {/* Payment Info */}
                    <GridItem>
                      <VStack align="flex-start" spacing={3}>
                        <Heading size="sm" color="gray.700">
                          Thông tin thanh toán
                        </Heading>
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
                      </VStack>
                    </GridItem>
                  </Grid>
                </Box>
              </HStack>
            </Container>
          </Box>

          <Container maxW="9xl" py={8}>
            <VStack align="stretch">
              {/* Order Status */}
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
                        {currentStatus?.icon && (
                          <currentStatus.icon size={16} />
                        )}
                        <Text fontWeight="medium">{currentStatus?.label}</Text>
                      </HStack>
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <OrderTimelineAdmin timeline={statusTimeline} />

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
                              Dự kiến giao hàng:
                              <Text as="span" fontWeight="bold">
                                {formatDate(
                                  data?.expectedDeliveryDate ??
                                    addDays(data?.orderDate, 7)
                                )}
                              </Text>
                            </Text>
                            {data.customerName}
                            <Text mt={1}>
                              Đơn hàng sẽ được giao sau 7 ngày kể từ ngày đặt
                              hàng.
                            </Text>
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </>
                  )}
                </CardBody>
              </Card>

              {/* Order Items and Timeline */}
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                {/* Order Items */}
                <GridItem>
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
                </GridItem>

                {/* Timeline */}
                <GridItem>
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
                </GridItem>
              </Grid>

              {/* Order Summary */}
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Tóm tắt đơn hàng</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
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

                      <Divider />

                      <Box
                        bg="white"
                        p={4}
                        borderRadius="xl"
                        boxShadow="0px 4px 24px rgba(0, 0, 0, 0.08)"
                        border="1px solid"
                        borderColor="gray.100"
                        position="relative"
                        overflow="hidden"
                        _after={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: "4px",
                          bgGradient: "linear(to-b, blue.500, teal.400)",
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <Icon
                              as={FiCreditCard}
                              color="blue.500"
                              boxSize={5}
                              mr={2}
                            />
                            <Text
                              fontSize="lg"
                              fontWeight="semibold"
                              color="gray.700"
                              letterSpacing="wide"
                            >
                              TỔNG PHẢI TRẢ
                            </Text>
                          </Flex>

                          <Box textAlign="right">
                            <Text
                              fontSize="2xl"
                              fontWeight="extrabold"
                              color="gray.800"
                              lineHeight="shorter"
                            >
                              {finalAmount.toLocaleString("vi-VN")}
                              <Text
                                as="span"
                                ml={1}
                                fontSize="md"
                                color="gray.500"
                              >
                                ₫
                              </Text>
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.500"
                              fontStyle="italic"
                              mt={1}
                            >
                              (Viết bằng chữ:{" "}
                              {convertNumberToWords(finalAmount)} đồng)
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    </VStack>

                    <Divider />

                    {/* Customer Actions */}
                    {/* <Box>
                      <Heading size="sm" mb={4}>
                        Hành động
                      </Heading>
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
                    </Box> */}
                  </VStack>
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
