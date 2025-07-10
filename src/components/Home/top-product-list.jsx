import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box, Text, useBreakpointValue, Flex, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Popover, Spin } from "antd";
import { useState, useEffect, memo } from "react";
import { mockProducts } from "../../const/mock-data/mock-products";
import { useQueryProductsList } from "../../services/customers/products";
import { useNavigate } from "react-router-dom";

const fallbackImages = [
  "https://picsum.photos/id/1015/400/200",
  "https://picsum.photos/id/1016/400/200",
  "https://picsum.photos/id/1020/400/200",
];

const getFallbackImage = () => {
  const index = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[index];
};

// Helper function to format price safely
const formatPrice = (price) => {
  if (!price) return "0";

  if (typeof price === "number") {
    return price.toLocaleString();
  }

  if (typeof price === "string") {
    const numericString = price.replace(/\D/g, "");
    const numericPrice = parseInt(numericString, 10);
    return isNaN(numericPrice) ? "0" : numericPrice.toLocaleString();
  }

  // Handle object case - convert to string first
  if (typeof price === "object" && price !== null) {
    try {
      return formatPrice(price.toString());
    } catch (error) {
      console.warn("Error converting price object to string:", error);
      return "0";
    }
  }

  return "0";
};

const ProductSlider = memo(() => {
  const navigate = useNavigate();

  // const internalData = [
  //   {
  //     id: 1048,
  //     brand: "yonex",
  //     name: "Vợt cầu lông Yonex Astrox 100ZZ",
  //     price: "3.500.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://shopvnb.com//uploads/san_pham/vot-cau-long-yonex-astrox-100zz-kurenai-do-new-2021-5.webp",
  //     description:
  //       "Vợt cầu lông Yonex Astrox 100ZZ dành cho người chơi chuyên nghiệp, trợ lực tốt, kiểm soát cầu chính xác, phù hợp đánh đôi và đơn.",
  //     discountPercentage: 20,
  //     originalPrice: 4375000,
  //     storeType: "Mall",
  //   },
  //   {
  //     id: 1047,
  //     brand: "lining",
  //     name: "Giày cầu lông Lining AYTM083-2",
  //     price: "1.200.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://product.hstatic.net/200000099191/product/sua_03f3a36d0c954dfb8e2487ce86dfca25.jpg",
  //     description:
  //       "Giày cầu lông Lining với đệm êm, chống trơn trượt, thiết kế ôm chân, hỗ trợ di chuyển linh hoạt trên sân.",
  //     discountPercentage: 10,
  //     originalPrice: 1333333,
  //     storeType: "Official Store",
  //   },
  //   {
  //     id: 1046,
  //     brand: "yonex",
  //     name: "Áo cầu lông Yonex 2024",
  //     price: "450.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://luongsport.com/wp-content/uploads/2018/05/z5277607217776_f2256403b15cbaa2b4efff2bf6015f71.jpg",
  //     description:
  //       "Áo cầu lông Yonex chất liệu thấm hút mồ hôi, thoáng khí, kiểu dáng thể thao năng động, phù hợp thi đấu và tập luyện.",
  //     discountPercentage: 5,
  //     originalPrice: 473684,
  //     storeType: "Yêu thích",
  //   },
  //   {
  //     id: 1045,
  //     brand: "mizuno",
  //     name: "Quả cầu lông Mizuno MZ-01",
  //     price: "320.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://edwardthienhoang.wordpress.com/wp-content/uploads/2015/10/original2-1224936-1.jpg?w=640",
  //     description:
  //       "Quả cầu lông Mizuno lông vũ tự nhiên, bay ổn định, độ bền cao, thích hợp cho luyện tập và thi đấu.",
  //     discountPercentage: 15,
  //     originalPrice: 376470,
  //     storeType: "Mall",
  //   },
  //   {
  //     id: 1044,
  //     brand: "victor",
  //     name: "Balo cầu lông Victor BR9009",
  //     price: "650.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://shopvnb.com//uploads/san_pham/balo-cau-long-victor-br-9009-cr-den-xanh-chinh-hang-1.webp",
  //     description:
  //       "Balo cầu lông Victor thiết kế nhiều ngăn, chất liệu chống thấm, đựng được vợt, giày và phụ kiện tiện lợi.",
  //     discountPercentage: 25,
  //     originalPrice: 866666,
  //     storeType: "Official Store",
  //   },
  //   {
  //     id: 1043,
  //     brand: "yonex",
  //     name: "Quấn cán vợt Yonex AC102EX",
  //     price: "60.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://cdn.shopvnb.com/uploads/images/quan-can-yonex-xin-ac102ex-cai.webp",
  //     description:
  //       "Quấn cán vợt Yonex giúp cầm vợt chắc chắn, thấm hút mồ hôi tốt, tăng độ bám khi thi đấu.",
  //     discountPercentage: 0,
  //     originalPrice: 60000,
  //     storeType: "Yêu thích",
  //   },
  //   {
  //     id: 1042,
  //     brand: "lining",
  //     name: "Túi đựng vợt cầu lông Lining ABJJ054",
  //     price: "480.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://cdn.shopvnb.com/uploads/san_pham/tui-cau-long-lining-abjj-054-1-xam-do-3-ngan--2.webp",
  //     description:
  //       "Túi đựng vợt Lining chất liệu bền đẹp, ngăn chứa rộng rãi, bảo vệ vợt khỏi va đập và bụi bẩn.",
  //     discountPercentage: 18,
  //     originalPrice: 585365,
  //     storeType: "Mall",
  //   },
  //   {
  //     id: 1041,
  //     brand: "yonex",
  //     name: "Dây cước cầu lông Yonex BG66 Ultimax",
  //     price: "180.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://cdn.shopvnb.com/uploads/san_pham/day-cuoc-cang-vot-yonex-bg66-ultimax-2.webp",
  //     description:
  //       "Dây cước Yonex BG66 Ultimax cho cảm giác đánh cầu nhạy, lực căng tốt, phù hợp mọi trình độ.",
  //     discountPercentage: 12,
  //     originalPrice: 204545,
  //     storeType: "Official Store",
  //   },
  //   {
  //     id: 1039,
  //     brand: "mizuno",
  //     name: "Vớ cầu lông Mizuno MSocks",
  //     price: "90.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://shopvnb.com//uploads/san_pham/vo-cau-long-mizuno-ngan-chinh-hang-1.webp",
  //     description:
  //       "Vớ cầu lông Mizuno co giãn, thấm hút mồ hôi, bảo vệ bàn chân khi vận động mạnh.",
  //     discountPercentage: 8,
  //     originalPrice: 97826,
  //     storeType: "Yêu thích",
  //   },
  //   {
  //     id: 1038,
  //     brand: "victor",
  //     name: "Băng cổ tay cầu lông Victor",
  //     price: "70.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://bissport.com/uploads/images/product/detail/2024/10/2024-19-10-15-12-215bang-co-tay-cau-long-pickleball-lining-632-chinh-hang-mau-xam-tham-hut-mo-hoi-co-gian-tot-nhe-khong-xu-long%20(7).jpg.jpg",
  //     description:
  //       "Băng cổ tay Victor hỗ trợ cổ tay, thấm hút mồ hôi, giảm chấn thương khi chơi cầu lông.",
  //     discountPercentage: 0,
  //     originalPrice: 70000,
  //     storeType: "Mall",
  //   },
  //   {
  //     id: 1037,
  //     brand: "lining",
  //     name: "Bình nước thể thao Lining 700ml",
  //     price: "110.000",
  //     price_sign: "₫",
  //     currency: "VND",
  //     image_link:
  //       "https://inochi.vn/wp-content/uploads/2022/01/binh_nuoc_Kita-Actice_detail.jpg",
  //     description:
  //       "Bình nước thể thao Lining dung tích lớn, chất liệu an toàn, tiện lợi mang theo khi tập luyện.",
  //     discountPercentage: 15,
  //     originalPrice: 129411,
  //     storeType: "Official Store",
  //   },
  // ];
  const { data, isLoading } = useQueryProductsList({
    pageNumber: 0,
    pageSize: 10,
  });

  // Safely get products data
  // const products = (() => {
  //   try {
  //     if (
  //       mockProducts &&
  //       Array.isArray(mockProducts) &&
  //       mockProducts.length > 0
  //     ) {
  //       return mockProducts;
  //     }
  //     return internalData.map((product) => ({
  //       Id: product.id,
  //       Name: product.name,
  //       Description: product.description,
  //       Images: [product.image_link],
  //       Variants: [{ Price: parseInt(product.price.replace(/\./g, "")) }],
  //       discountPercentage: product.discountPercentage,
  //       storeType: product.storeType,
  //       originalPrice: product.originalPrice,
  //     }));
  //   } catch (error) {
  //     console.error("Error processing products data:", error);
  //     return [];
  //   }
  // })();

  const slidesPerView = useBreakpointValue({
    base: 2.5,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 7,
  });

  const spaceBetween = useBreakpointValue({
    base: 8,
    sm: 10,
    md: 12,
    lg: 14,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const calculateTimeLeft = () => {
    try {
      const now = new Date();
      const endTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        23,
        59,
        59
      );

      const difference = +endTime - +now;
      let remaining = {};

      if (difference > 0) {
        remaining = {
          hours: Math.floor(difference / (1000 * 60 * 60))
            .toString()
            .padStart(2, "0"),
          minutes: Math.floor((difference / 1000 / 60) % 60)
            .toString()
            .padStart(2, "0"),
          seconds: Math.floor((difference / 1000) % 60)
            .toString()
            .padStart(2, "0"),
        };
      } else {
        remaining = { hours: "00", minutes: "00", seconds: "00" };
      }
      return remaining;
    } catch (error) {
      console.error("Error calculating time:", error);
      return { hours: "00", minutes: "00", seconds: "00" };
    }
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Early return if no products
  if (!data?.items || data?.items.length === 0) {
    return (
      <Box py={4} my={8} w={"100%"}>
        <Box
          w={"100%"}
          bg={"white"}
          mx="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={4}
          textAlign="center"
        >
          <Text>Không có sản phẩm để hiển thị</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box py={4} my={8} w={"100%"}>
      <Spin spinning={isLoading}>
        <Box
          w={"100%"}
          bg={"white"}
          mx="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          overflow="hidden"
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            p={3}
            borderBottom="1px solid #ee4d2d"
            bg="#FFFBF8"
          >
            <Flex alignItems="center" gap={2}>
              <Text
                fontSize={{ base: "md", sm: "lg", md: "xl" }}
                fontWeight="extrabold"
                color="#ee4d2d"
              >
                FLASH SALE
              </Text>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                color="#ee4d2d"
                bg="rgba(238, 77, 45, 0.1)"
                px={2}
                py={0.5}
                borderRadius="sm"
              >
                {timeLeft.hours}{" "}
                <Text as="span" color="#ee4d2d">
                  :
                </Text>{" "}
                {timeLeft.minutes}{" "}
                <Text as="span" color="#ee4d2d">
                  :
                </Text>{" "}
                {timeLeft.seconds}
              </Text>
            </Flex>
            <Button
              variant="link"
              colorScheme="orange"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate('/productpage')}
            >
              Xem tất cả &gt;
            </Button>
          </Flex>

          <Box
            className="swiper-container-with-borders"
            sx={{
              ".swiper-slide:not(:last-child)": {
                borderRight: "1px solid",
                borderColor: "gray.100",
              },
            }}
          >
            <Swiper
              slidesPerView={slidesPerView}
              spaceBetween={spaceBetween}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              modules={[Pagination, Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              style={{
                paddingBottom: "40px",
                paddingTop: "10px",
                "--swiper-pagination-color": "#ee4d2d",
                "--swiper-pagination-bullet-inactive-color": "#ccc",
              }}
            >
              {data?.items.map((product, index) => (
                <SwiperSlide
                  key={product?.Id || index}
                  style={{ height: "auto" }}
                >
                  <Box
                    borderWidth="0"
                    onClick={() => navigate(`/product/${product.id}`)}
                    borderRadius="md"
                    overflow="hidden"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "sm",
                    }}
                    transition="all 0.2s ease"
                    h="auto"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    bg="white"
                  >
                    <Box
                      width="100%"
                      aspectRatio="1/1"
                      overflow="hidden"
                      position="relative"
                      bg="gray.50"
                    >
                      <Box
                        as="img"
                        src={
                          product?.images?.[0] ||
                          product?.Variants?.[0]?.Images?.[0] ||
                          getFallbackImage()
                        }
                        alt={product?.name || "Product image"}
                        objectFit="contain"
                        width="100%"
                        height="100%"
                        loading="lazy"
                      />

                      {product?.discountPercentage > 0 && (
                        <Flex
                          position="absolute"
                          bottom="0"
                          right="0"
                          bg="#FFB800"
                          color="white"
                          px={1}
                          py={0.5}
                          fontSize="xs"
                          fontWeight="bold"
                          borderTopLeftRadius="md"
                          alignItems="center"
                          justifyContent="center"
                          zIndex={1}
                          height="20px"
                        >
                          -{product.discountPercentage}%
                        </Flex>
                      )}

                      {product?.storeType && (
                        <Text
                          position="absolute"
                          top="0"
                          left="0"
                          bg={
                            product.storeType === "Mall"
                              ? "#EE4D2D"
                              : product.storeType === "Official Store"
                              ? "#1976D2"
                              : "#808080"
                          }
                          color="white"
                          px={1}
                          py={0.5}
                          fontSize="xs"
                          fontWeight="bold"
                          borderBottomRightRadius="md"
                          textTransform="uppercase"
                          zIndex={1}
                        >
                          {product.storeType === "Yêu thích"
                            ? "YÊU THÍCH"
                            : product.storeType.toUpperCase()}
                        </Text>
                      )}
                    </Box>

                    <Box
                      p={2}
                      flex={1}
                      display="flex"
                      flexDirection="column"
                      w="100%"
                    >
                      <Text
                        color="gray.700"
                        fontSize="sm"
                        mb={1}
                        noOfLines={2}
                        height="2.4em"
                        lineHeight="1.2em"
                        overflow="hidden"
                      >
                        <Popover
                          content={product?.name || "Tên sản phẩm"}
                          trigger="hover"
                        >
                          <span>{product?.name || "Tên sản phẩm"}</span>
                        </Popover>
                      </Text>

                      <Box
                        display="flex"
                        alignItems="baseline"
                        mb={1}
                        justifyContent="center"
                      >
                        {product?.originalPrice &&
                          product?.discountPercentage && (
                            <Text
                              textDecoration="line-through"
                              color="gray.400"
                              fontSize="xs"
                              mr={1}
                            >
                              {formatPrice(product.originalPrice) ?? 450000}₫
                            </Text>
                          )}
                        <Text fontWeight="bold" color="#ee4d2d" fontSize="md">
                          {formatPrice(product?.variants?.[0]?.price) ||
                            formatPrice(product?.price) ||
                            "999.999"}
                          ₫
                        </Text>
                      </Box>
                      <Flex justifyContent="center" mt="auto">
                        <Box
                          bg="#FFF8E0"
                          color="#D6A50A"
                          fontSize="11"
                          fontWeight="bold"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          textTransform="uppercase"
                          minW="80px"
                          textAlign="center"
                        >
                          ĐANG BÁN CHẠY
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      </Spin>
    </Box>
  );
});

// Set display name for debugging
ProductSlider.displayName = "ProductSlider";

ProductSlider.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      Name: PropTypes.string,
      Description: PropTypes.string,
      Images: PropTypes.arrayOf(PropTypes.string),
      Variants: PropTypes.arrayOf(
        PropTypes.shape({
          Price: PropTypes.number,
          Images: PropTypes.arrayOf(PropTypes.string),
        })
      ),
      discountPercentage: PropTypes.number,
      storeType: PropTypes.oneOf(["Mall", "Official Store", "Yêu thích"]),
      originalPrice: PropTypes.number,
      price: PropTypes.string,
      image_link: PropTypes.string,
    })
  ),
};

// Export default
export default ProductSlider;
