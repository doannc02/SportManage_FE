import { Swiper, SwiperSlide } from "swiper/react";
import { Image, Box, Text } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { Autoplay, Scrollbar } from "swiper/modules";
import { Images } from "../../asserts/images";

const images = [
  "https://yumo.ca/cdn/shop/files/25.01.23-2.png?v=1737677229",
  "https://rikisport.vn/wp-content/uploads/2024/09/WEBSITE-BANNER-NU.jpg",
  "https://theme.hstatic.net/200000832469/1001182604/14/slider_2.jpg?v=182",
  "https://yumo.ca/cdn/shop/files/Technist_Giveaway-3_1080x.png?v=1742060323",
  "https://file.hstatic.net/200000627545/collection/phu_kien_the_thao_1920x480_3f6fd2b972d8468789b5975eece48426.png",
  "https://aocaulongthietke.com/wp-content/uploads/2021/06/Banner-trang-chu-ao-bong-chuyen-thiet-ke.jpg",
];

export default function Carousel() {
  // Danh sách ảnh và tiêu đề
  const iconItems = [
    { src: Images.promotion, label: "Deal giá sốc" },
    { src: Images.voucher, label: "Voucher cực khủng" },
    { src: Images.coin, label: "Săn xu ngay" },
    { src: Images.shopping, label: "Shopping mall" },
    { src: Images.members, label: "Khách hàng thân thiết" },
  ];

  return (
    <Box
      borderRadius="xl"
      maxW={"100%"}
      overflow={"auto"}
      boxShadow="lg"
      bg="white"
      mt={{ base: "10px", md: "30px" }}
    >
      <Box
        w="100%"
        // maxW={{ base: "95vw", md: "90vw" }}
        h={{ base: "180px", sm: "220px", md: "250px", lg: "300px" }}
        mx="auto"
        position="relative"
        overflow="hidden"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 2, md: 4 }}
        p={{ base: 1, md: 4 }}
      >
        {/* Main Swiper - Chiếm toàn bộ chiều rộng trên mobile */}
        <Box
          w="100%"
          maxW={"95vw"}
          h="100%"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="md"
        >
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            scrollbar={{
              hide: true,
            }}
            modules={[Autoplay, Scrollbar]}
            className="mySwiper"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx}>
                <Box h="100%" w="100%" position="relative" overflow="hidden">
                  <Image
                    src={src}
                    alt={`Banner ${idx + 1}`}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    minH="100%"
                    transition="transform 0.5s ease"
                    _hover={{ transform: "scale(1.03)" }}
                    borderRadius="xl"
                    loading="eager"
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Side Images - Chỉ hiển thị trên tablet/desktop */}
        <Box
          w={{ base: "0", md: "30%" }}
          h="100%"
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          gap={4}
        >
          <Box
            flex={1}
            w="100%"
            position="relative"
            overflow="hidden"
            borderRadius="xl"
            boxShadow="md"
          >
            <Image
              src="https://rikisport.vn/wp-content/uploads/2024/09/WEBSITE-BANNER-NU.jpg"
              alt="Banner 1"
              objectFit="cover"
              w="100%"
              h="100%"
              transition="transform 0.5s ease"
              _hover={{ transform: "scale(1.03)" }}
            />
          </Box>
          <Box
            flex={1}
            w="100%"
            position="relative"
            overflow="hidden"
            borderRadius="xl"
            boxShadow="md"
          >
            <Image
              src="https://rikisport.vn/wp-content/uploads/2024/09/WEBSITE-BANNER-NAM.jpg"
              alt="Banner 2"
              objectFit="cover"
              w="100%"
              h="100%"
              transition="transform 0.5s ease"
              _hover={{ transform: "scale(1.03)" }}
            />
          </Box>
        </Box>
      </Box>

      {/* Icon list: Swiper on mobile, flex on desktop */}
      <Box
        w={{ base: "100%", md: "100%" }}
        mt={{ base: "10px", md: "30px" }}
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        boxShadow="lg"
        bg="white"
        px={7}
        pb={3}
      >
        {/* Mobile: Swiper */}
        <Box
          display={{ base: "block", md: "none" }}
          w="100%"
          maxW={"90vw"}
          overflow="visible"
        >
          <Swiper
            spaceBetween={12}
            slidesPerView={3}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay]}
            style={{ width: "100%" }}
          >
            {iconItems.map((item, idx) => (
              <SwiperSlide key={idx}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  w="100%"
                >
                  <Box
                    w="41px"
                    h="41px"
                    position="relative"
                    overflow="hidden"
                    borderRadius="xl"
                    boxShadow="md"
                  >
                    <Image
                      src={item.src}
                      alt={item.label}
                      transition="transform 0.5s ease"
                      _hover={{ transform: "scale(1.2)" }}
                      objectFit="cover"
                      w="41px"
                      h="41px"
                    />
                  </Box>
                  <Text textAlign="center" fontSize="sm" mt={1}>
                    {item.label}
                  </Text>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        {/* Desktop: Flex */}
        <Box
          display={{ base: "none", md: "flex" }}
          justifyContent="space-between"
          gap={4}
        >
          {iconItems.map((item, idx) => (
            <Box
              key={idx}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                w="41px"
                h="41px"
                position="relative"
                overflow="hidden"
                borderRadius="xl"
                boxShadow="md"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  transition="transform 0.5s ease"
                  _hover={{ transform: "scale(1.2)" }}
                  objectFit="cover"
                  w="41px"
                  h="41px"
                />
              </Box>
              <Text textAlign="center" fontSize="sm" mt={1}>
                {item.label}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
