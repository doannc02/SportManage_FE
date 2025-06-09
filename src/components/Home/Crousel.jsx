import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image, Box } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./style.css";
import { Autoplay, Navigation, Scrollbar } from "swiper/modules";

const images = [
  "https://yumo.ca/cdn/shop/files/25.01.23-2.png?v=1737677229",
  "https://rikisport.vn/wp-content/uploads/2024/09/WEBSITE-BANNER-NU.jpg",
  "https://theme.hstatic.net/200000832469/1001182604/14/slider_2.jpg?v=182",
  "https://yumo.ca/cdn/shop/files/Technist_Giveaway-3_1080x.png?v=1742060323",
  "https://file.hstatic.net/200000627545/collection/phu_kien_the_thao_1920x480_3f6fd2b972d8468789b5975eece48426.png",
  "https://aocaulongthietke.com/wp-content/uploads/2021/06/Banner-trang-chu-ao-bong-chuyen-thiet-ke.jpg",
];

export default function App() {
  return (
    <Box
      h={{ base: "30vh", md: "50vh", lg: "60vh" }}
      w="100%"
      maxW="90vw"
      mt={"50px"}
      mx="auto"
      position="relative"
      overflow="hidden"
      borderRadius="xl"
      boxShadow="lg"
      bg="gray.100"
      display="flex"
      flexDirection="row"
      gap={4}
      p={4}
    >
      {/* Swiper bên trái */}
      <Box
        w="70%"
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
          loop
          scrollbar={{
            hide: true,
          }}
          modules={[Scrollbar]}
          className="mySwiper"
          style={{ height: "100%", width: "100%" }}
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx}>
              <Box
                h="100%"
                w="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="relative"
                overflow="hidden"
              >
                <Image
                  src={src}
                  alt={`Banner ${idx + 1}`}
                  objectFit="cover"
                  h="100%"
                  w="100%"
                  transition="transform 0.5s"
                  _hover={{ transform: "scale(1.03)" }}
                  borderRadius="xl"
                  boxShadow="md"
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      {/* Hai ảnh bên phải */}
      <Box
        w="30%"
        h="100%"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Image
          src={'https://rikisport.vn/wp-content/uploads/2024/09/WEBSITE-BANNER-NU.jpg'}
          alt="Banner 1"
          objectFit="cover"
          h="50%"
          w="100%"
          transition="transform 0.5s"
          _hover={{ transform: "scale(1.03)" }}
          borderRadius="xl"
          boxShadow="md"
        />
        <Image
          src={'https://rikisport.vn/wp-content/uploads/2024/09/WEBSITE-BANNER-NAM.jpg'}
          alt="Banner 2"
          objectFit="cover"
          h="50%"
          w="100%"
          transition="transform 0.5s"
          _hover={{ transform: "scale(1.03)" }}
          borderRadius="xl"
          boxShadow="md"
        />
      </Box>
    </Box>
  );
}
