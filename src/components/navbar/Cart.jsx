import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Box, Flex, Text } from "@chakra-ui/react";
import { BsMinecartLoaded } from "react-icons/bs";
import { BaggageClaim } from "lucide-react";
import { Popover } from "antd";

const Cart = forwardRef(({ num }, ref) => {
  return (
    <>
      <Popover content={"Giỏ hàng"}>
        <Flex
          alignItems="center"
          ref={ref}
          cursor="pointer"
          _hover={{ bg: "gray.50", borderRadius: "md", boxShadow: "sm" }}
          px={4}
          py={2}
          transition="all 0.2s"
          position="relative"
          minW="48px"
        >
          <Box position="relative" display="flex" alignItems="center" h="32px">
            <BaggageClaim strokeWidth={1} />
            {num > 0 && (
              <Text
                position="absolute"
                top="-8px"
                right="-12px"
                px="7px"
                h="20px"
                minW="20px"
                fontSize="12px"
                fontWeight="bold"
                lineHeight="20px"
                textAlign="center"
                color="white"
                bgGradient="linear(to-tr, red.500, orange.400)"
                boxShadow="0 2px 6px rgba(0,0,0,0.18)"
                borderRadius="full"
                border="2px solid white"
                zIndex={1}
              >
                {num}
              </Text>
            )}
          </Box>
        </Flex>
      </Popover>
    </>
  );
});

Cart.displayName = "Cart";
Cart.propTypes = {
  num: PropTypes.number,
};

export default Cart;
