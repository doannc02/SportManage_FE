import { Box, Text, SimpleGrid, Image, Button, Center } from "@chakra-ui/react";
import React from "react";

import { Link } from "react-router-dom";

const Trending = () => {

  return (
    <Box
      maxW="100%"
      mx="auto"
      py={10}
      px={{ base: 4, md: 8 }}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        mb={8}
        textAlign="center"
        color="gray.700"
        letterSpacing="wide"
      >
        Danh mục hàng hóa mới nhập
      </Text>
      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 6 }}
        spacing={6}
        mb={12}
      >
        {[
          "https://cdn.shopvnb.com/uploads/images/tin_tuc/top-12-dung-cu-va-phu-kien-cau-long-ma-nguoi-choi-can-mang-theo-khi-ra-san-1.webp",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQv1HUQJGHitmejzZRzCqJJ9ZU0WMTQVSUqQ&s",
          "https://product.hstatic.net/200000099191/product/z6141436574698_23c61467a1914d1db59fcd5f4203d9ea_5a965ec611544f42abbb946020cd5b75.jpg",
          "https://hidosport.vn/wp-content/uploads/2024/01/ao-cau-long-yonex-co-tru-TYN2302-xanh.jpg",
          "https://badmintonworldbalcatta.com/cdn/shop/files/IMG-0209.png?v=1717510289",
          "https://bizweb.dktcdn.net/100/504/891/products/z5183007652125-b514d76928dbba518e242c7845a307c1-1708596030618.jpg?v=1708596033647",
        ].map((src, idx) => (
          <Link to="/" key={idx}>
            <Box
              bg="gray.50"
              borderRadius="md"
              p={3}
              transition="box-shadow 0.2s"
              _hover={{ boxShadow: "md", bg: "gray.100" }}
              textAlign="center"
            >
              <Image
                boxSize={{ base: "80px", md: "100px", lg: "120px" }}
                mx="auto"
                src={src}
                alt={`Danh mục ${idx + 1}`}
                objectFit="contain"
              />
            </Box>
          </Link>
        ))}
      </SimpleGrid>

      <Box mb={12} borderRadius="lg" overflow="hidden" boxShadow="md">
        <Image
          src="https://dasxsport.vn/storage/promotion/z5359930446165-06f56edd24238b5a4542f1d91dce1d15.jpg"
          w="100%"
          objectFit="cover"
        />
      </Box>

      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        mb={8}
        textAlign="center"
        color="gray.700"
        letterSpacing="wide"
      >
        Ưu đãi nổi bật
      </Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={8}
        w="100%"
      >
        {[
          {
            img: "https://noidia.b-cdn.net/thumbnails/769157226300.jpg",
            title: "Bộ đồ cầu lông mới nam nữ",
            desc:
              "Nhận ngay voucher free ship và thẻ giảm giá 30% cho đơn hàng từ 2 bộ trở lên",
          },
          {
            img: "https://thethaotruonggiang.vn/wp-content/uploads/2018/09/vot-cau-long-yonex-4.jpg",
            title: "Combo 3 vợt cầu lông Yonex",
            desc:
              "Nhận bộ quà tặng dụng cụ sửa chữa cầu lông (trị giá $135) khi mua từ $250.",
          },
          {
            img: "https://cbu01.alicdn.com/img/ibank/O1CN01gMJ2ue1npFyPPwjV4_!!2208023765138-0-cib.jpg",
            title: "Vợt cầu lông dành cho bé gái",
            desc:
              "Mặt hàng mới ra mắt, mua 2 tặng 1, miễn phí 1 năm bảo hành",
          },
        ].map((offer, idx) => (
          <Box
            key={idx}
            bg="gray.50"
            borderRadius="lg"
            boxShadow="sm"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: "lg", bg: "gray.100" }}
          >
            <Image
              borderRadius="full"
              boxSize={{ base: "90px", md: "120px" }}
              src={offer.img}
              alt={offer.title}
              mb={4}
              objectFit="cover"
              border="2px solid"
              borderColor="gray.200"
            />
            <Text className="truncate" fontWeight="bold" fontSize="lg" mb={2} color="gray.700">
              {offer.title}
            </Text>
            <Text fontSize="md" color="gray.600" mb={4} textAlign="center">
              {offer.desc}
            </Text>
            <Button
              as={Link}
              to="/"
              colorScheme="teal"
              variant="solid"
              borderRadius="full"
              px={6}
              fontWeight="bold"
              _hover={{ bg: "teal.600" }}
            >
              Mua ngay
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Trending;
