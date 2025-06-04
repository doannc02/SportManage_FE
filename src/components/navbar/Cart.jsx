import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Box, Flex, Text } from "@chakra-ui/react";
import { BsMinecartLoaded } from "react-icons/bs";

const Cart = forwardRef(({ num }, ref) => {
  return (
    <Flex alignItems="center" ref={ref}>
      <Box display="flex" alignItems="center" h="30px" position="relative">
        <BsMinecartLoaded size="20px" />
        {num > 0 && (
          <Text
            position="absolute"
            top="-5px"
            right="-10px"
            px="4px"
            h="16px"
            minW="16px"
            fontSize="10px"
            lineHeight="16px"
            textAlign="center"
            color="white"
            bg="red.500"
            borderRadius="full"
          >
            {num}
          </Text>
        )}
      </Box>
      <Text marginLeft={4} display={{ lg: "initial", md: "none", sm: "none", base: "none" }}>
        Cart
      </Text>
    </Flex>
  );
});

Cart.displayName = "Cart";
Cart.propTypes = {
  num: PropTypes.number,
};

export default Cart;
