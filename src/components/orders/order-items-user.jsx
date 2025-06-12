import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { BASE_URL } from "../../configs/auth";
import PropTypes from "prop-types";

const OrderItemUser = ({ item }) => {
  const { productId, productName, quantity, unitPrice, totalPrice, imageUrl } =
    item;

  return (
    <Box
      p={4}
      borderBottom="1px"
      borderColor="gray.100"
      _last={{ borderBottom: "none" }}
    >
      <HStack align="flex-start" spacing={4}>
        <Image
          src={
            imageUrl
              ? `${BASE_URL}${imageUrl}`
              : "https://png.pngtree.com/png-clipart/20191120/original/pngtree-package-glyph-icon-vector-png-image_5058430.jpg"
          }
          alt={productName}
          boxSize="64px"
          objectFit="cover"
          borderRadius="lg"
          flexShrink={0}
        />
        <Box flex={1} minW={0}>
          <Text fontWeight="medium" color="gray.900" noOfLines={2}>
            {productName}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            ID: {productId}
          </Text>
          <Flex justify="space-between" align="center" mt={2}>
            <Text fontSize="sm" color="gray.600">
              Số lượng:{" "}
              <Text as="span" fontWeight="medium">
                {quantity}
              </Text>
            </Text>
            <Box textAlign="right">
              <Text fontSize="sm" color="gray.600">
                {unitPrice.toLocaleString()} VND
              </Text>
              <Text fontWeight="medium" color="teal.600">
                {totalPrice.toLocaleString()} VND
              </Text>
            </Box>
          </Flex>
        </Box>
      </HStack>
    </Box>)
};

OrderItemUser.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    productName: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unitPrice: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default OrderItemUser
