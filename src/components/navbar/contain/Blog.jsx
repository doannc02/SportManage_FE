import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Text,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import React from "react";

import NavStyle from "../navbar.module.css";

function Blog() {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Box className={NavStyle.blackHover} p="7px">
          Cẩm nang
        </Box>
      </PopoverTrigger>
      <PopoverContent w="80vw">
        <PopoverArrow />
        <PopoverBody bg="#f5f3f3" p="25px">
          <SimpleGrid gap="40px" columns={5}>
            <Box bg="white" className={NavStyle.shadowHover}>
              <Image
                w="100%"
                src="https://contents.mediadecathlon.com/p2548275/747a997a9c2d14277e593bf23e1d40fc/p2548275.jpg?format=auto&quality=70&f=800x0"
              />
              <Text py="5px" textAlign="center">
                Vợt cầu lông
              </Text>
            </Box>
            <Box bg="white" className={NavStyle.shadowHover}>
              <Image
                w="100%"
                src="https://contents.mediadecathlon.com/p2472352/af8f295eaf3567b69d29d87cb6aaad6c/p2472352.jpg?format=auto&quality=70&f=800x0"
              />
              <Text py="5px" textAlign="center">
                Quả cầu
              </Text>
            </Box>
            <Box bg="white" className={NavStyle.shadowHover}>
              <Image
                w="100%"
                src="https://contents.mediadecathlon.com/p2472357/f7b183006edb54ed2483cd282bc18085/p2472357.jpg?format=auto&quality=70&f=800x0"
              />
              <Text py="5px" textAlign="center">
                Giày cầu lông
              </Text>
            </Box>
            <Box bg="white" className={NavStyle.shadowHover}>
              <Image
                w="100%"
                src="https://images.unsplash.com/photo-1601987077862-1c6b00c191b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
              />
              <Text py="5px" textAlign="center">
                Căng dây vợt
              </Text>
            </Box>
            <Box bg="white" className={NavStyle.shadowHover}>
              <Image
                w="100%"
                src="https://images.unsplash.com/photo-1594942695034-6f5f028994a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
              />
              <Text py="5px" textAlign="center">
                Phụ kiện cầu lông
              </Text>
            </Box>
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default Blog;
