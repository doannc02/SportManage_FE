import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image, Box } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./style.css";
import { Autoplay, Navigation } from "swiper/modules";

const images = [
  "https://yumo.ca/cdn/shop/files/25.01.23-2.png?v=1737677229",
  "https://theme.hstatic.net/200000832469/1001182604/14/slider_2.jpg?v=182",
  "https://yumo.ca/cdn/shop/files/Technist_Giveaway-3_1080x.png?v=1742060323",
  "https://www.shopcaulong247.com/upload/hinhanh/1461854921_830x310.jpg",
  "https://aocaulongthietke.com/wp-content/uploads/2021/06/Banner-trang-chu-ao-bong-chuyen-thiet-ke.jpg",
];

export default function App() {
  return (
    <Box h="60vh" w="95%">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Box display="flex" justifyContent="center" alignItems="center" h="100%" w="100%">
              <Image
                src={src}
                objectFit="contain"
                h="100%"
                w="100%"
                maxH="50vh"
                maxW="100%"
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
