import { useState } from "react";
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
  Image,
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
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  Copy,
  Download,
  ArrowLeft,
  Star,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Circle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryOrderDetail } from "../../../services/customers/orders";
import { BASE_URL } from "../../../configs/auth";
import CoreLoading from "../../../components/atoms/CoreLoading";

// Mock order data
const mockOrderData = {
  id: "ORD-2024-001234",
  status: "confirmed",
  statusDisplay: "Đã xác nhận",
  createdAt: "2024-01-15T10:30:00Z",
  estimatedDelivery: "2024-01-20T00:00:00Z",
  totalAmount: 57980000,
  discountAmount: 5798000,
  shippingFee: 0,
  finalAmount: 52182000,
  paymentMethod: "COD",
  paymentStatus: "shipping",
  voucher: {
    code: "FIRST10",
    name: "Giảm giá 10% cho đơn hàng đầu tiên",
    discount: 5798000,
  },
  customer: {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
  },
  shippingAddress: {
    recipientName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Đường ABC, Phường XYZ",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    fullAddress: "123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh",
  },
  items: [
    {
      id: 1,
      productVariant: {
        name: "iPhone 15 Pro Max - 256GB - Titan Tự Nhiên",
        price: 29990000,
        image: "/api/placeholder/300/300",
        sku: "IP15PM-256-TN",
      },
      quantity: 1,
      unitPrice: 29990000,
      totalPrice: 29990000,
    },
    {
      id: 2,
      productVariant: {
        name: "MacBook Air M2 - 13 inch - 256GB - Midnight",
        price: 27990000,
        image: "/api/placeholder/300/300",
        sku: "MBA-M2-13-256-MN",
      },
      quantity: 1,
      unitPrice: 27990000,
      totalPrice: 27990000,
    },
  ],
  timeline: [
    {
      status: "confirmed",
      title: "Đơn hàng đã được xác nhận",
      description: "Đơn hàng của bạn đã được xác nhận và đang chuẩn bị",
      timestamp: "2024-01-15T10:30:00Z",
      completed: true,
    },
    {
      status: "processing",
      title: "Đang chuẩn bị hàng",
      description: "Chúng tôi đang chuẩn bị sản phẩm cho đơn hàng của bạn",
      timestamp: null,
      completed: false,
    },
    {
      status: "shipping",
      title: "Đang giao hàng",
      description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
      timestamp: null,
      completed: false,
    },
    {
      status: "delivered",
      title: "Đã giao hàng",
      description: "Đơn hàng đã được giao thành công",
      timestamp: null,
      completed: false,
    },
  ],
};

// Status configuration
const statusConfig = {
  pending: {
    colorScheme: "yellow",
    icon: Clock,
    label: "Chờ xác nhận",
  },
  confirmed: {
    colorScheme: "blue",
    icon: CheckCircle,
    label: "Đã xác nhận",
  },
  processing: {
    colorScheme: "purple",
    icon: Package,
    label: "Đang chuẩn bị",
  },
  shipping: {
    colorScheme: "orange",
    icon: Truck,
    label: "Đang giao hàng",
  },
  delivered: {
    colorScheme: "green",
    icon: CheckCircle2,
    label: "Đã giao hàng",
  },
  cancelled: {
    colorScheme: "red",
    icon: XCircle,
    label: "Đã hủy",
  },
};

// Timeline component
const OrderTimeline = ({ timeline }) => {
  return (
    <VStack align="stretch" spacing={6}>
      {timeline.map((step, index) => {
        const isLast = index === timeline.length - 1;
        return (
          <Box key={step.status} position="relative">
            {/* Timeline line */}
            {!isLast && (
              <Box
                position="absolute"
                left="15px"
                top="32px"
                width="2px"
                height="64px"
                bg={step.completed ? "teal.500" : "gray.200"}
              />
            )}

            <HStack align="flex-start" spacing={4}>
              {/* Timeline node */}
              <Box
                position="relative"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="32px"
                height="32px"
                borderRadius="full"
                border="2px solid"
                borderColor={step.completed ? "teal.500" : "gray.300"}
                bg={step.completed ? "teal.500" : "white"}
              >
                {step.completed ? (
                  <CheckCircle2 size={20} color="white" />
                ) : (
                  <Circle size={12} color="gray" />
                )}
              </Box>

              {/* Timeline content */}
              <Box flex={1}>
                <Text
                  fontWeight="medium"
                  color={step.completed ? "gray.900" : "gray.500"}
                >
                  {step.title}
                </Text>
                <Text
                  fontSize="sm"
                  color={step.completed ? "gray.600" : "gray.400"}
                >
                  {step.description}
                </Text>
                {step.timestamp && (
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    {new Date(step.timestamp).toLocaleString("vi-VN")}
                  </Text>
                )}
              </Box>
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );
};

// Product item component
const OrderItem = ({ item }) => {
  const { productId, productName, quantity, unitPrice, totalPrice, imageUrl } = item;

  return (
    <Box
      p={4}
      borderBottom="1px"
      borderColor="gray.100"
      _last={{ borderBottom: "none" }}
    >
      <HStack align="flex-start" spacing={4}>
        <Image
          src={
            imageUrl ? `${BASE_URL}${imageUrl}` : "https://png.pngtree.com/png-clipart/20191120/original/pngtree-package-glyph-icon-vector-png-image_5058430.jpg"
          }
          alt={productName}
          boxSize="64px"
          objectFit="cover"
          borderRadius="lg"
          flexShrink={0}
        />
        <Box flex={1} minW={0}>
          <Text fontWeight="medium" color="gray.900" noOfLines={2}>
            {productName}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            ID: {productId}
          </Text>
          <Flex justify="space-between" align="center" mt={2}>
            <Text fontSize="sm" color="gray.600">
              Số lượng:{" "}
              <Text as="span" fontWeight="medium">
                {quantity}
              </Text>
            </Text>
            <Box textAlign="right">
              <Text fontSize="sm" color="gray.600">
                {unitPrice.toLocaleString()} VND
              </Text>
              <Text fontWeight="medium" color="teal.600">
                {totalPrice.toLocaleString()} VND
              </Text>
            </Box>
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
};

const OrderDetailPage = () => {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(mockOrderData);
  const { id } = useParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const currentStatus = statusConfig[mockOrderData?.status];
  const { data, isLoading } = useQueryOrderDetail({ id: id });
  console.log("order detail", data);
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

  const handleRefreshOrder = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
    <>{isLoading ? <CoreLoading /> : <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg={cardBg} borderBottom="1px" borderColor="gray.200">
        <Container maxW="6xl" py={6}>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <IconButton
                icon={<ArrowLeft size={20} />}
                onClick={() => navigate(-1)}
                // variant="ghost"
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
            <HStack spacing={3}>
              <Button
                leftIcon={<RefreshCw size={16} />}
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
                    <Badge
                      colorScheme={currentStatus.colorScheme}
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      <HStack spacing={2}>
                        <currentStatus.icon size={16} />
                        <Text fontWeight="medium">{currentStatus.label}</Text>
                      </HStack>
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <OrderTimeline timeline={orderData?.timeline} />

                  <Alert status="info" mt={6} borderRadius="lg">
                    <AlertIcon as={AlertCircle} />
                    <Box>
                      <AlertTitle>Thông tin giao hàng</AlertTitle>
                      <AlertDescription>
                        <Text>
                          Dự kiến giao hàng:{" "}
                          <Text as="span" fontWeight="bold">
                            {formatDate(addDays(data?.orderDate, 7))}
                          </Text>
                        </Text>
                        <Text mt={1}>
                          Đơn hàng sẽ được giao sau 7 ngày kể từ ngày đặt hàng.
                        </Text>
                      </AlertDescription>
                    </Box>
                  </Alert>
                </CardBody>
              </Card>

              {/* Order Items */}
              <Card bg={cardBg}>
                <CardHeader borderBottom="1px" borderColor="gray.200">
                  <Heading size="md">Sản phẩm đã đặt</Heading>
                </CardHeader>
                <CardBody p={0}>
                  {data?.orderItems?.map((item) => (
                    <OrderItem key={item.id} item={item} />
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

                    <Flex justify="space-between">
                      <Text color="gray.600">Phí vận chuyển:</Text>
                      <Text>
                        {orderData?.shippingFee === 0
                          ? "Miễn phí"
                          : orderData?.shippingFee.toLocaleString() + " VND"}
                      </Text>
                    </Flex>

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
                    <CreditCard size={20} color="gray" />
                    <Box>
                      <Text fontWeight="medium">
                        {orderData?.paymentMethod === "COD"
                          ? "Thanh toán khi nhận hàng"
                          : "Thẻ tín dụng"}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={
                          orderData?.paymentStatus === "paid"
                            ? "green.600"
                            : orderData?.paymentStatus === "failed"
                              ? "red.600"
                              : "yellow.600"
                        }
                      >
                        {orderData?.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : orderData?.paymentStatus === "failed"
                            ? "Thanh toán thất bại"
                            : "Chưa thanh toán"}
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
                          {orderData?.customer.email}
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
                      <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
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

                    <HStack spacing={3}>
                      <Clock size={16} color="gray" />
                      <Box>
                        <Text color="gray.600">Dự kiến giao hàng:</Text>
                        <Text fontWeight="medium">
                          {formatDate(addDays(data?.orderDate, 7))}
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>}</>
  );
};

export default OrderDetailPage;
