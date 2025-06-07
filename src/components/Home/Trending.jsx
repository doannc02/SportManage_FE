import { Box, Text, SimpleGrid, Image, Button, Center } from "@chakra-ui/react";
import React from "react";

import { Link } from "react-router-dom";

const Trending = () => {

  return (
    <Box
      maxW="1200px"
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
          "https://static.thcdn.com/images/small/webp/widgets/121-us/57/original-Page-001%5B1%5D-054257.png",
          "https://static.thcdn.com/images/small/webp/widgets/121-us/01/original-Page-002%5B1%5D-054301.png",
          "https://static.thcdn.com/images/small/webp/widgets/121-us/10/original-Page-003%5B1%5D-054310.png",
          "https://static.thcdn.com/images/small/webp/widgets/121-us/19/original-Page-004%5B1%5D-054319.png",
          "https://static.thcdn.com/images/small/webp/widgets/121-us/28/original-Page-005%5B1%5D-054328.png",
          "https://static.thcdn.com/images/small/webp/widgets/121-us/36/original-Page-006%5B1%5D-054336.png",
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
          src="https://static.thcdn.com/images/xlarge/webp/widgets/121-us/08/original-Page-120%5B1%5D-103608.png"
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
            img: "https://static.thcdn.com/images/small/webp/widgets/121-us/53/original-500x500-041753.jpeg",
            title: "Skin Ceuticals Gift",
            desc:
              "Nhận ngay SkinCeuticals Resveratrol BE 4ml (trị giá $21) khi mua hàng từ $220 trở lên.",
          },
          {
            img: "https://static.thcdn.com/images/small/webp/widgets/121-us/05/original-500x500-041805.jpeg",
            title: "25% off SkinMedica + Quà tặng $135",
            desc:
              "Nhận bộ quà tặng SkinMedica Eye Illuminating Kit (trị giá $135) khi mua từ $250.",
          },
          {
            img: "https://static.thcdn.com/images/small/webp/widgets/121-us/14/original-500x500-060614.jpg",
            title: "25% off 111SKIN + Quà tặng $95",
            desc:
              "Nhận 111SKIN Space Defence Bright Eye Lift Gel Mini 7.5ml (trị giá $95) khi mua từ $250.",
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
