import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "@chakra-ui/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./style.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Box } from "@chakra-ui/react";

export default function App() {
  return (
    <Box h="70vh" w="92%">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        // pagination={{
        //   clickable: true,
        // }}
        // navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image
            src={
              "https://yumo.ca/cdn/shop/files/25.01.23-2.png?v=1737677229"
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={
              "https://theme.hstatic.net/200000832469/1001182604/14/slider_2.jpg?v=182"
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Image src="https://yumo.ca/cdn/shop/files/Technist_Giveaway-3_1080x.png?v=1742060323" />{" "}
        </SwiperSlide>
        <SwiperSlide>
          <Image src="https://www.shopcaulong247.com/upload/hinhanh/1461854921_830x310.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src="https://aocaulongthietke.com/wp-content/uploads/2021/06/Banner-trang-chu-ao-bong-chuyen-thiet-ke.jpg" />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}
