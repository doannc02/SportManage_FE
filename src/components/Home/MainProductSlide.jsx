import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { ArrowBigUpDash } from "lucide-react";

const fallbackImages = [
  "https://picsum.photos/id/1015/400/200",
  "https://picsum.photos/id/1016/400/200",
  "https://picsum.photos/id/1020/400/200",
];

const getFallbackImage = () => {
  const index = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[index];
};

export const ProductSlider = ({ products }) => {
  const slidesPerView = useBreakpointValue({
    base: 1.2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  });

  const spaceBetween = useBreakpointValue({
    base: 10,
    sm: 12,
    md: 14,
    lg: 16,
  });

  return (
    <Box  px={{ base: 4, md: 8 }} py={4} my={8} w={"100%"}>
      <Text
        fontSize={{ base: "md", md: "2xl" }}
        fontWeight="bold"
        textAlign="center"
        mb={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        Top những sản phẩm bán chạy nhất
        <ArrowBigUpDash />
      </Text>

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
          "--swiper-pagination-color": "#1976d2",
          "--swiper-pagination-bullet-inactive-color": "#ccc",
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product?.Id || index} style={{ height: "auto" }}>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s ease"
              h="100%"
              display="flex"
              flexDirection="column"
            >
              <Box
                width="100%"
                aspectRatio="1/1"
                overflow="hidden"
                position="relative"
              >
                <Box
                  as="img"
                  src={
                    product?.Images?.[0] ||
                    product?.Variants?.[0]?.Images?.[0] ||
                    getFallbackImage()
                  }
                  alt={product?.Name || "Product image"}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>

              <Box p={4} flex={1} display="flex" flexDirection="column">

                <Text
                  color="gray.600"
                  fontSize="sm"
                  mb={3}
                  noOfLines={2}
                  flex={1}
                >
                  {product?.Name || "Tên sản phẩm"}
                </Text>

                <Box display="flex" alignItems="center" mb={4}>
                  <Text fontWeight="bold" color="red.500" fontSize="lg">
                    {product?.Variants?.[0]?.Price?.toLocaleString() ||
                      "999,999"}
                    ₫
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {/* <ArrowUpNarrowWide size={18} color="#3182ce" /> */}
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Đã bán {product?.BoughtCount ?? 0}
                  </Text>
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

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
    })
  ),
};
