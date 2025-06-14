import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
  useColorModeValue,
  Image,
  Center,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  useDisclosure,
  Collapse,
  SlideFade,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Tooltip,
  Skeleton,
  ScaleFade,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { MdPayment } from "react-icons/md";
import { UserContext } from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import CartQuantity from "./CartQuantity";
import { BASE_URL } from "../../configs/auth";
import { useMutation } from "react-query";
import {
  useQueryCartDetail,
  removeCartItem,
} from "../../services/customers/carts";
import { useQueryAvailableVouchers } from "../../services/customers/vouchers";
import { FaCheck, FaShoppingCart, FaTags, FaTrash } from "react-icons/fa";
import { BiChevronRight } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
import RecommendProductSection from "./recommend-product-section";
import ShippingAndPaymentInfo from "./shipping-payment-info";
import { createOrderUser } from "../../services/customers/orders";
import CreditCardForm from "../../pages/CreditCardForm";
import { DialogRemove } from "./dialogs/dialog-remove-cart";
import { SelectPaymentMethod } from "./select-payment-method";
import { LoadingSkeletonCart } from "./loading-item-cart";
import { AddressInfo } from "./address-info";
import { InfoDetailPayment } from "./Info-detail-payment";
import { VoucherCard } from "./voucher-card";
import { ItemCartEmpty } from "./item-cart-emtpy";
import { GroupButton } from "./group-button";
import { DialogProceessingPayment } from "./dialogs/dialog-processing-payment";
import { DialogSuccessPayment } from "./dialogs/dialog-susccess-payment";

// Animation variants for framer-motion
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Styled motion component for each cart row
const MotionTr = motion(Tr);

const CartTable = () => {
  const { user, setUser } = useContext(UserContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [voucherInputValue, setVoucherInputValue] = useState("");
  const [shippingAddressId, setShippingAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [creditCardInfo, setCreditCardInfo] = useState({
    number: "",
    name: "",
    cvc: "",
  });

  // State cho dialog thanh toán thành công
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { isLoading, data, refetch } = useQueryCartDetail();
  const { data: vouchers, isLoading: isLoadingVouchers } =
    useQueryAvailableVouchers();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCreditModalOpen,
    onOpen: onOpenCreditCardModal,
    onClose: onCloseCreditCardModal,
  } = useDisclosure();

  // Disclosure cho dialog thanh toán thành công
  const {
    isOpen: isPaymentSuccessOpen,
    onOpen: onOpenPaymentSuccess,
    onClose: onClosePaymentSuccess,
  } = useDisclosure();

  // State để theo dõi việc auto-create order
  const [isAutoCreatingOrder, setIsAutoCreatingOrder] = useState(false);

  const cancelRef = useRef();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const accentColor = useColorModeValue("teal.500", "teal.300");
  const subtleColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const { mutate: createOrder, isLoading: isLoadingCreateOrder } = useMutation(
    createOrderUser,
    {
      onSuccess: (res) => {
        // Đóng dialog thanh toán thành công nếu đang mở
        if (isPaymentSuccessOpen) {
          onClosePaymentSuccess();
        }
        setIsAutoCreatingOrder(false);
        onClosePaymentSuccess();

        toast({
          title: "Tạo đơn hàng thành công!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          icon: <FaCheck />,
        });
        setUser((prev) => ({ ...prev, totalCartItems: res.totalCartItems }));
        refetch();
        navigate(`/order/${res}`);
      },
      onError: (error) => {
        onClosePaymentSuccess();
        setIsAutoCreatingOrder(false);
        if (paymentMethod === "CreditCard") {
          const { number, name } = creditCardInfo;
          toast({
            title: "Lỗi khi tạo đơn hàng!",
            description: `Số tiền ${(
              cartTotal - voucherDiscount
            ).toLocaleString()} VND đã thanh toán sẽ được hoàn về tài khoản ${name} - ${number}`,
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
        toast({
          title: "Lỗi khi tạo đơn hàng!",
          description: error?.response?.data?.message || "Có lỗi xảy ra",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
    }
  );

  const { mutate: removeItem } = useMutation(removeCartItem, {
    onSuccess: (res) => {
      toast({
        title: "Đã xóa sản phẩm khỏi giỏ hàng",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
        icon: <FaCheck />,
      });
      setUser((prev) => ({ ...prev, totalCartItems: res.totalCartItems }));
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Lỗi xóa sản phẩm",
        description: error?.response?.data?.message || "Có lỗi xảy ra",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Hàm kiểm tra thông tin thẻ tín dụng
  const validateCreditCardInfo = () => {
    const { number, expiry, cvc, name } = creditCardInfo;
    if (!number?.trim()) {
      toast({
        title: "Vui lòng nhập số thẻ",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return false;
    }

    if (!expiry?.trim()) {
      toast({
        title: "Vui lòng nhập ngày hết hạn",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return false;
    }

    if (!cvc?.trim()) {
      toast({
        title: "Vui lòng nhập mã CVV",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return false;
    }

    if (!name?.trim()) {
      toast({
        title: "Vui lòng nhập tên chủ thẻ",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  // Hàm xử lý thanh toán thành công - tự động tạo đơn hàng
  const handlePaymentSuccess = () => {
    setIsAutoCreatingOrder(true);

    console.log(
      shippingAddressId,
      data,
      selectedVoucher,
      paymentMethod,
      "==============input========="
    );
    const formatInputOrder = {
      items: (data ?? []).map((i) => {
        return {
          productVariantId: i.productVariantId,
          quantity: i.quantity,
        };
      }),
      shippingAddressId: shippingAddressId,
      voucherCode: selectedVoucher?.code ?? null,
      paymentMethod: paymentMethod,
      notes: "",
    };
    // Tự động tạo đơn hàng sau 2.5 giây để người dùng thấy thông báo thành công
    setTimeout(() => {
      createOrder(formatInputOrder);
    }, 2500);
  };

  // Hàm mô phỏng quá trình thanh toán bằng thẻ
  const simulateCreditCardPayment = async () => {
    setIsProcessingPayment(true);

    // Mô phỏng thời gian xử lý thanh toán (2-3 giây)
    await new Promise((resolve) =>
      setTimeout(resolve, 3000 + Math.random() * 1000)
    );

    setIsProcessingPayment(false);

    // Giả lập thành công thanh toán (có thể thêm logic kiểm tra thực tế ở đây)
    const paymentSuccess = Math.random() > 0.1; // 90% thành công

    if (paymentSuccess) {
      onOpenPaymentSuccess();
      // Tự động tạo đơn hàng sau khi hiển thị thông báo thành công
      handlePaymentSuccess();
    } else {
      toast({
        title: "Thanh toán thất bại!",
        description: "Vui lòng kiểm tra lại thông tin thẻ và thử lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm xử lý click nút thanh toán
  const handleCheckout = async () => {
    if (!shippingAddressId) {
      toast({
        title: "Vui lòng chọn địa chỉ giao hàng",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    let method = paymentMethod;
    if (!method) {
      toast({
        title: "Vui lòng chọn phương thức thanh toán",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (method === "CreditCard") {
      // Kiểm tra thông tin thẻ trước khi thanh toán
      if (!validateCreditCardInfo()) {
        return;
      }
      // Nếu thanh toán bằng thẻ, mô phỏng quá trình thanh toán
      await simulateCreditCardPayment();
    } else {
      const formatInputOrder = {
        items: (data ?? []).map((i) => {
          return {
            productVariantId: i.productVariantId,
            quantity: i.quantity,
          };
        }),
        shippingAddressId: shippingAddressId,
        voucherCode: selectedVoucher.code,
        paymentMethod: method,
        notes: "",
      };
      // Nếu thanh toán COD hoặc phương thức khác, tạo đơn hàng trực tiếp
      await createOrder({ formatInputOrder });
    }
  };

  useEffect(() => {
    if (data) {
      const total = data.reduce((acc, item) => {
        return acc + (item.productVariant?.price || 0) * item.quantity;
      }, 0);
      setCartTotal(total);
      user.totalPrice = total;
    }
  }, [data]);

  useEffect(() => {
    if (selectedVoucher) {
      if (cartTotal >= selectedVoucher.minOrderValue) {
        const discount =
          selectedVoucher.discountTypeDisplay === "Percentage"
            ? (cartTotal * selectedVoucher.discountValue) / 100
            : selectedVoucher.discountValue;
        setVoucherDiscount(discount);
      } else {
        setVoucherDiscount(0);
        toast({
          title: `Đơn hàng chưa đủ điều kiện áp dụng mã "${selectedVoucher.code}"`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [selectedVoucher, cartTotal]);

  const handleSelectVoucher = (voucher) => {
    if (cartTotal < voucher.minOrderValue) {
      toast({
        title: `Đơn hàng chưa đủ điều kiện áp dụng mã "${voucher.code}"`,
        description: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()} VND`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedVoucher?.id === voucher.id) {
      // Deselect if already selected
      setSelectedVoucher(null);
      setVoucherDiscount(0);
      setVoucherInputValue("");
      toast({
        title: "Đã hủy mã giảm giá",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      // Select new voucher
      setSelectedVoucher(voucher);
      setVoucherInputValue(voucher.code);
      toast({
        title: `Áp dụng mã "${voucher.code}" thành công!`,
        status: "success",
        duration: 2000,
        isClosable: true,
        icon: <Icon as={BsCheck2Circle} />,
      });
    }

    setShowVoucherList(false);
  };

  const handleSelectPaymentMethod = async (method) => {
    if (method === "CreditCard" && paymentMethod !== "CreditCard") {
      onOpenCreditCardModal(); // Chỉ mở khi lần đầu chọn CreditCard
    }
    setPaymentMethod(method);
    await handleCheckout();
  };

  const handleVoucherCodeSubmit = (e) => {
    e.preventDefault();

    if (!voucherInputValue.trim()) return;

    const foundVoucher = vouchers?.find((v) => v.code === voucherInputValue);

    if (foundVoucher) {
      handleSelectVoucher(foundVoucher);
    } else {
      toast({
        title: "Mã không hợp lệ",
        description: "Mã giảm giá không tồn tại hoặc đã hết hạn",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const emptyCart = !isLoading && (!data || data.length === 0);

  return (
    <Container maxW="container.xl">
      <Flex direction="column" gap={6}>
        {/* Header */}
        <Box mb={2}>
          <Heading size="lg" mb={2} display="flex" alignItems="center">
            <Icon as={FaShoppingCart} mr={3} color={accentColor} />
            Giỏ hàng
            {data && data.length > 0 && (
              <Badge
                ml={2}
                colorScheme="teal"
                borderRadius="full"
                px={2}
                fontSize="sm"
              >
                {data.length} sản phẩm
              </Badge>
            )}
          </Heading>
          <Divider />
        </Box>

        {/* Main content */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={6}
          align="flex-start"
        >
          {/* Cart items list and payment info */}
          <Box flex="1" overflow="hidden" w="full">
            {isLoading ? (
              // Loading skeleton
              <LoadingSkeletonCart />
            ) : emptyCart ? (
              // Empty cart view
              <ItemCartEmpty navigate={navigate} />
            ) : (
              <Card
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
                bg={useColorModeValue("white", "gray.800")}
              >
                <TableContainer>
                  <Table>
                    <Thead bg={subtleColor}>
                      <Tr>
                        <Th>Sản phẩm</Th>
                        <Th>Tên</Th>
                        <Th>Số lượng</Th>
                        <Th isNumeric>Giá</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.map((item, index) => {
                        const variant = item.productVariant;
                        return (
                          <MotionTr
                            key={item.id}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            bg={
                              hoveredItemId === item.id
                                ? subtleColor
                                : "transparent"
                            }
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() => setHoveredItemId(null)}
                            _hover={{ transform: "translateY(-2px)" }}
                            style={{ transition: "all 0.2s" }}
                          >
                            <Td>
                              <Image
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="md"
                                src={`${BASE_URL}${variant.images?.[0]}`}
                                alt={variant.name}
                                fallback={
                                  <Center
                                    boxSize="80px"
                                    bg="gray.100"
                                    borderRadius="md"
                                  >
                                    No image
                                  </Center>
                                }
                              />
                            </Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">{variant.name}</Text>
                                {variant.stockQuantity <= 5 && (
                                  <Badge
                                    colorScheme="red"
                                    variant="subtle"
                                    fontSize="xs"
                                  >
                                    Còn {variant.stockQuantity} sản phẩm
                                  </Badge>
                                )}
                              </VStack>
                            </Td>
                            <Td>
                              <CartQuantity
                                refetch={refetch}
                                maxQty={variant.stockQuantity}
                                cartItemId={item.id}
                                quantity={item.quantity}
                              />
                            </Td>
                            <Td isNumeric>
                              <VStack align="end" spacing={0}>
                                <Text fontWeight="medium">
                                  {variant.price.toLocaleString()} VND
                                </Text>
                                <Text
                                  fontSize="sm"
                                  color={accentColor}
                                  fontWeight="medium"
                                >
                                  ={" "}
                                  {(
                                    variant.price * item.quantity
                                  ).toLocaleString()}{" "}
                                  VND
                                </Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Tooltip label="Xóa sản phẩm" placement="top">
                                <IconButton
                                  icon={<FaTrash />}
                                  colorScheme="red"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItemId(item.id);
                                    onOpen();
                                  }}
                                  aria-label="Xóa sản phẩm"
                                />
                              </Tooltip>
                            </Td>
                          </MotionTr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Card>
            )}
            <Divider p={5} />
            {/* Checkout summary */}
            <ScaleFade in={!emptyCart} initialScale={0.9}>
              <Card
                p={5}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
                bg={useColorModeValue("white", "gray.800")}
              >
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" mb={2} display="flex" alignItems="center">
                    <Icon as={MdPayment} mr={2} color={accentColor} />
                    Thanh toán
                  </Heading>
                  {paymentMethod === "CreditCard" && (
                    <CreditCardForm onCardInfoChange={setCreditCardInfo} />
                  )}
                  <InfoDetailPayment
                    accentColor={accentColor}
                    cartTotal={cartTotal}
                    selectedVoucher={selectedVoucher}
                    voucherDiscount={voucherDiscount}
                  />

                  <GroupButton
                    navigate={navigate}
                    isLoadingCreateOrder={
                      isLoadingCreateOrder ||
                      isProcessingPayment ||
                      isAutoCreatingOrder
                    }
                    onClick={handleCheckout}
                  />

                  <ShippingAndPaymentInfo />
                </VStack>
              </Card>
            </ScaleFade>
          </Box>

          {/* Order summary */}
          <Box w={{ base: "full", lg: "350px" }} position="sticky" top="20px">
            {/* Vouchers */}
            <SlideFade in={!emptyCart} offsetY="20px">
              <Card
                mb={6}
                p={5}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <VStack align="stretch" spacing={4}>
                  <Flex justify="space-between" align="center">
                    <Flex align="center">
                      <Icon as={FaTags} color={accentColor} mr={2} />
                      <Text fontWeight="semibold">Mã giảm giá</Text>
                    </Flex>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="teal"
                      rightIcon={<Icon as={BiChevronRight} />}
                      onClick={() => setShowVoucherList(!showVoucherList)}
                    >
                      {showVoucherList ? "Ẩn danh sách" : "Xem tất cả"}
                    </Button>
                  </Flex>

                  <form onSubmit={handleVoucherCodeSubmit}>
                    <InputGroup size="md">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={voucherInputValue}
                        onChange={(e) => setVoucherInputValue(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          colorScheme="teal"
                          variant="ghost"
                          type="submit"
                        >
                          Áp dụng
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </form>

                  <Collapse in={showVoucherList} animateOpacity>
                    <VStack
                      align="stretch"
                      pt={2}
                      maxH="300px"
                      overflowY="auto"
                    >
                      {isLoadingVouchers ? (
                        <Stack spacing={3}>
                          <Skeleton height="60px" />
                          <Skeleton height="60px" />
                          <Skeleton height="60px" />
                        </Stack>
                      ) : vouchers?.length === 0 ? (
                        <Text textAlign="center" color="gray.500" py={2}>
                          Không có mã giảm giá khả dụng
                        </Text>
                      ) : (
                        vouchers?.map((voucher) => (
                          <VoucherCard
                            key={voucher.id}
                            voucher={voucher}
                            isSelected={selectedVoucher?.id === voucher.id}
                            onSelect={handleSelectVoucher}
                            cartTotal={cartTotal}
                          />
                        ))
                      )}
                    </VStack>
                  </Collapse>

                  {selectedVoucher && (
                    <Flex
                      p={3}
                      bg={useColorModeValue("teal.50", "teal.900")}
                      borderRadius="md"
                      align="center"
                      as={motion.div}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Icon
                        as={BsCheck2Circle}
                        color="teal.500"
                        boxSize={5}
                        mr={3}
                      />
                      <Box flex="1">
                        <Text fontWeight="medium">
                          Mã "{selectedVoucher.code}" được áp dụng
                        </Text>
                        <Text
                          fontSize="sm"
                          color={useColorModeValue("teal.600", "teal.200")}
                        >
                          Giảm {voucherDiscount.toLocaleString()} VND
                        </Text>
                      </Box>
                      <IconButton
                        aria-label="Remove voucher"
                        icon={<FaTrash />}
                        size="sm"
                        variant="ghost"
                        colorScheme="teal"
                        onClick={() => {
                          setSelectedVoucher(null);
                          setVoucherDiscount(0);
                          setVoucherInputValue("");
                        }}
                      />
                    </Flex>
                  )}
                </VStack>
              </Card>
            </SlideFade>
            <SelectPaymentMethod onChange={handleSelectPaymentMethod} />
            <AddressInfo onChange={(id) => setShippingAddressId(id)} />
          </Box>
        </Flex>
      </Flex>
      <DialogRemove
        selectedItemId={selectedItemId}
        cancelRef={cancelRef}
        removeItem={removeItem}
        isOpen={isOpen}
        onClose={onClose}
      />
      {/* Dialog thanh toán thành công */}
      <DialogSuccessPayment
        cartTotal={cartTotal}
        isAutoCreatingOrder={isAutoCreatingOrder}
        isPaymentSuccessOpen={isPaymentSuccessOpen}
        selectedVoucher={selectedVoucher}
        voucherDiscount={voucherDiscount}
      />
      {/* Modal xử lý thanh toán */}
      <DialogProceessingPayment isProcessingPayment={isProcessingPayment} />
      {/* Recommended Products Section */}
      {!emptyCart && <RecommendProductSection />}
    </Container>
  );
};

export default CartTable;
