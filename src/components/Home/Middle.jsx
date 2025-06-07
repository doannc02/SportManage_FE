import { Box, SimpleGrid, Image } from "@chakra-ui/react";
import React from "react";

const sponsors = [
  {
    src: "https://static.thcdn.com/images/small/webp/widgets/121-us/26/180x72_4_233548301_CA_SS_Logo_Amend_BAU_THG0030424-041301-124116-063126.png",
    alt: "Sponsor 1",
  },
  {
    src: "https://static.thcdn.com/images/small/webp/widgets/121-us/18/original-logo-1024x383-035229-063318.png",
    alt: "Sponsor 2",
  },
  {
    src: "https://static.thcdn.com/images/small/webp/widgets/121-us/11/Revision_Skincare_Logo_without_Tag_Line-052511.png",
    alt: "Sponsor 3",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Logo-Yonex.svg/2560px-Logo-Yonex.svg.png",
    alt: "Yonex",
  },
  {
    src: "https://www.jordan1.vn/wp-content/uploads/2024/03/cach-logo-puma-phat-trien-va-doi-moi-khong-ngung-10.png",
    alt: "Puma",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    alt: "Nike",
  },
];

const Middle = () => {
  return (
    <Box w="90%" bg="white" py={12} px={[4, 8, 16]} >
      <Box textAlign="center" mb={8}>
        <Box
          as="h2"
          fontSize={["2xl"]}
          fontWeight="bold"
          color="gray.700"
          letterSpacing="wide"
        >
          Những Nhãn Hàng Mà Chúng Tôi Đã Hợp Tác
        </Box>
        <Box
          w={["60px", "80px"]}
          h="3px"
          bgGradient="linear(to-r, teal.400, blue.400)"
          mx="auto"
          mt={2}
          borderRadius="full"
        />
      </Box>
      <SimpleGrid
        columns={[2, 3, 6]}
        spacing={[6, 10, 14]}
        w="100%"
        justifyItems="center"
        alignItems="center"
      >
        {sponsors.map((sponsor, idx) => (
          <Box key={idx} display="flex" justifyContent="center" alignItems="center">
            <Image
              width={["80px", "110px", "140px"]}
              height="auto"
              objectFit="contain"
              src={sponsor.src}
              alt={sponsor.alt}
              filter="grayscale(30%)"
              transition="filter 0.2s"
              _hover={{ filter: "none", transform: "scale(1.05)" }}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Middle;
