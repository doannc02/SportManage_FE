import { Swiper, SwiperSlide } from "swiper/react";
import { Image, Box, Text, SimpleGrid } from "@chakra-ui/react";
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
    { src: Images.promotion, label: "Hàng chọn giá hời" },
    { src: Images.voucher, label: "Giảm giá" },
  ];

  return (
    // Container bao ngoài cùng, chỉ để chứa các phần và đặt margin top
    // Không có border/shadow ở đây
    <Box mt={{ base: "10px", md: "30px" }} w="100%">
      {/* Box căn giữa toàn bộ phần banner và icon list */}
      <Box
        w={{ base: "100%", md: "75%", lg: "63%" }} // Đồng bộ width với các phần khác của trang
        mx="auto" // Căn giữa nội dung
      >
        {/* Box chính cho phần banner và side images */}
        <Box
          border="1px solid" // Thêm border
          borderColor="gray.200" // Màu xám nhạt
          borderRadius="md" // Bo góc nhẹ
          bg="white" // Nền trắng để nổi bật border
          h={{ base: "180px", sm: "320px", md: "400px", lg: "450px" }}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 4 }}
          p={{ base: 2, md: 0 }} // Giảm hoặc bỏ padding nếu muốn hình ảnh sát mép hơn
          overflow="hidden" // Giữ overflow để hình ảnh không tràn ra khỏi border
        >
          {/* Main Swiper */}
          <Box
            w={{ base: "100%", md: "70%" }}
            h="100%"
            overflow="hidden" // Giữ overflow để cắt ảnh nếu tràn
            // Bỏ các style border/shadow khác bên trong nếu có
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
                      // Bỏ bo tròn cho từng ảnh trong swiper để border của Box cha hoạt động
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
              // Bỏ bo tròn và đổ bóng cho từng banner phụ
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
              // Bỏ bo tròn và đổ bóng cho từng banner phụ
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

        {/* Icon list: Container riêng */}
        <Box
          mt={{ base: "10px", md: "20px" }}
          position="relative"
          border="1px solid" // Thêm border
          borderColor="gray.200" // Màu xám nhạt
          borderRadius="md" // Bo góc nhẹ
          bg="white" // Nền trắng để nổi bật border
          p={{ base: 4, md: 4 }} // Padding cho toàn bộ phần icon list
          overflow="hidden" // Giữ overflow
        >
          {/* Mobile: Swiper for icons */}
          <Box
            display={{ base: "block", md: "none" }}
            w="100%"
            overflow="visible"
          >
            <Swiper
              spaceBetween={12}
              slidesPerView={4}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              loop={true}
              modules={[Autoplay]}
              style={{ width: "100%", paddingBottom: "10px" }}
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
                      w="48px"
                      h="48px"
                      position="relative"
                      overflow="hidden"
                      // Bỏ bo tròn và đổ bóng cho icon
                    >
                      <Image
                        src={item.src}
                        alt={item.label}
                        transition="transform 0.5s ease"
                        _hover={{ transform: "scale(1.1)" }}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                      />
                    </Box>
                    <Text textAlign="center" fontSize="sm" mt={1} noOfLines={1}>
                      {item.label}
                    </Text>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* Desktop: SimpleGrid for icons */}
          <SimpleGrid
            display={{ base: "none", md: "grid" }}
            columns={{ md: 6, lg: 7 }}
            spacing={4}
            justifyItems="center"
          >
            {iconItems.map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                w="100%"
              >
                <Box
                  w="48px"
                  h="48px"
                  position="relative"
                  overflow="hidden"
                  // Bỏ bo tròn và đổ bóng cho icon
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    transition="transform 0.5s ease"
                    _hover={{ transform: "scale(1.1)" }}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Text textAlign="center" fontSize="sm" mt={1} noOfLines={1}>
                  {item.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}
