import { Swiper, SwiperSlide } from "swiper/react";
import { Image, Text, Box, useBreakpointValue } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Scrollbar } from "swiper/modules";

export default function ProductSlider() {
  let data = [
    {
      id: 1048,
      brand: "yonex",
      name: "Vợt cầu lông Yonex Astrox 100ZZ",
      price: "3.500.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://shopvnb.com//uploads/san_pham/vot-cau-long-yonex-astrox-100zz-kurenai-do-new-2021-5.webp",
      description:
        "Vợt cầu lông Yonex Astrox 100ZZ dành cho người chơi chuyên nghiệp, trợ lực tốt, kiểm soát cầu chính xác, phù hợp đánh đôi và đơn.",
    },
    {
      id: 1047,
      brand: "lining",
      name: "Giày cầu lông Lining AYTM083-2",
      price: "1.200.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://product.hstatic.net/200000099191/product/sua_03f3a36d0c954dfb8e2487ce86dfca25.jpg",
      description:
        "Giày cầu lông Lining với đệm êm, chống trơn trượt, thiết kế ôm chân, hỗ trợ di chuyển linh hoạt trên sân.",
    },
    {
      id: 1046,
      brand: "yonex",
      name: "Áo cầu lông Yonex 2024",
      price: "450.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://luongsport.com/wp-content/uploads/2018/05/z5277607217776_f2256403b15cbaa2b4efff2bf6015f71.jpg",
      description:
        "Áo cầu lông Yonex chất liệu thấm hút mồ hôi, thoáng khí, kiểu dáng thể thao năng động, phù hợp thi đấu và tập luyện.",
    },
    {
      id: 1045,
      brand: "mizuno",
      name: "Quả cầu lông Mizuno MZ-01",
      price: "320.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://edwardthienhoang.wordpress.com/wp-content/uploads/2015/10/original2-1224936-1.jpg?w=640",
      description:
        "Quả cầu lông Mizuno lông vũ tự nhiên, bay ổn định, độ bền cao, thích hợp cho luyện tập và thi đấu.",
    },
    {
      id: 1044,
      brand: "victor",
      name: "Balo cầu lông Victor BR9009",
      price: "650.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://shopvnb.com//uploads/san_pham/balo-cau-long-victor-br-9009-cr-den-xanh-chinh-hang-1.webp",
      description:
        "Balo cầu lông Victor thiết kế nhiều ngăn, chất liệu chống thấm, đựng được vợt, giày và phụ kiện tiện lợi.",
    },
    {
      id: 1043,
      brand: "yonex",
      name: "Quấn cán vợt Yonex AC102EX",
      price: "60.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://cdn.shopvnb.com/uploads/images/quan-can-yonex-xin-ac102ex-cai.webp",
      description:
        "Quấn cán vợt Yonex giúp cầm vợt chắc chắn, thấm hút mồ hôi tốt, tăng độ bám khi thi đấu.",
    },
    {
      id: 1042,
      brand: "lining",
      name: "Túi đựng vợt cầu lông Lining ABJJ054",
      price: "480.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://cdn.shopvnb.com/uploads/san_pham/tui-cau-long-lining-abjj-054-1-xam-do-3-ngan--2.webp",
      description:
        "Túi đựng vợt Lining chất liệu bền đẹp, ngăn chứa rộng rãi, bảo vệ vợt khỏi va đập và bụi bẩn.",
    },
    {
      id: 1041,
      brand: "yonex",
      name: "Dây cước cầu lông Yonex BG66 Ultimax",
      price: "180.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://cdn.shopvnb.com/uploads/san_pham/day-cuoc-cang-vot-yonex-bg66-ultimax-2.webp",
      description:
        "Dây cước Yonex BG66 Ultimax cho cảm giác đánh cầu nhạy, lực căng tốt, phù hợp mọi trình độ.",
    },
    {
      id: 1039,
      brand: "mizuno",
      name: "Vớ cầu lông Mizuno MSocks",
      price: "90.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://shopvnb.com//uploads/san_pham/vo-cau-long-mizuno-ngan-chinh-hang-1.webp",
      description:
        "Vớ cầu lông Mizuno co giãn, thấm hút mồ hôi, bảo vệ bàn chân khi vận động mạnh.",
    },
    {
      id: 1038,
      brand: "victor",
      name: "Băng cổ tay cầu lông Victor",
      price: "70.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://bissport.com/uploads/images/product/detail/2024/10/2024-19-10-15-12-215bang-co-tay-cau-long-pickleball-lining-632-chinh-hang-mau-xam-tham-hut-mo-hoi-co-gian-tot-nhe-khong-xu-long%20(7).jpg.jpg",
      description:
        "Băng cổ tay Victor hỗ trợ cổ tay, thấm hút mồ hôi, giảm chấn thương khi chơi cầu lông.",
    },
    {
      id: 1037,
      brand: "lining",
      name: "Bình nước thể thao Lining 700ml",
      price: "110.000",
      price_sign: "₫",
      currency: "VND",
      image_link: "https://inochi.vn/wp-content/uploads/2022/01/binh_nuoc_Kita-Actice_detail.jpg",
      description:
        "Bình nước thể thao Lining dung tích lớn, chất liệu an toàn, tiện lợi mang theo khi tập luyện.",
    },
  ];

  // Responsive values
  const slidesPerView = useBreakpointValue({ base: 1.5, sm: 2, md: 3, lg: 4 });
  const spaceBetween = useBreakpointValue({ base: 16, md: 24, lg: 30 });
  const imageSize = useBreakpointValue({ base: "160px", sm: "180px", md: "200px", lg: "220px" });
  const titleFontSize = useBreakpointValue({ base: "md", sm: "lg", md: "xl" });
  const priceFontSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl" });
  const descFontSize = useBreakpointValue({ base: "xs", sm: "sm" });
 // const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const cardPadding = useBreakpointValue({ base: 3, md: 4, lg: 5 });

  return (
    <Box
      maxW={"100%"}
      mx="auto"
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 6 }}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      mt={{ base: 6, md: 10 }}
    >
      <Text
        fontWeight={700}
        w="100%"
        textAlign="center"
        mb={{ base: 6, md: 8 }}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        letterSpacing="wide"
        color="gray.800"
      >
        Gợi ý cho bạn
      </Text>
      
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        scrollbar={{ hide: true }}
        modules={[Scrollbar, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper"
        style={{ 
          padding: "0 8px 32px 8px",
          width: "100%"
        }}
      >
        {data.map((el) => (
          <SwiperSlide key={el.id} style={{ height: "auto" }}>
            <Box
              bg="gray.50"
              borderRadius="xl"
              boxShadow="md"
              p={cardPadding}
              h="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              transition="all 0.3s ease"
              _hover={{ 
                boxShadow: "xl", 
                transform: "translateY(-4px)",
                bg: "gray.100"
              }}
            >
              <Image
                mb={{ base: 3, md: 4, lg: 5 }}
                src={el.image_link}
                alt={el.name}
                borderRadius="md"
                boxSize={imageSize}
                objectFit="cover"
                bg="white"
                boxShadow="sm"
                loading="lazy"
              />
              
              <Box flex="1" w="100%" textAlign="center">
                <Text
                  fontWeight={600}
                  fontSize={titleFontSize}
                  mb={2}
                  color="gray.700"
                  noOfLines={2}
                >
                  {el.name}
                </Text>
                
                <Text
                  fontWeight={500}
                  color="cyan.600"
                  fontSize={priceFontSize}
                  mb={2}
                >
                  {el.price_sign}
                  {el.price}
                  <Text as="span" fontSize="sm" color="gray.500" ml={1}>
                    {el.currency}
                  </Text>
                </Text>
                
                <Text
                  fontSize={descFontSize}
                  color="gray.500"
                  noOfLines={3}
                  mb={{ base: 3, md: 4 }}
                >
                  {el.description.replace(/<[^>]+>/g, "")}
                </Text>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}