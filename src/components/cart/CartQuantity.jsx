import { Box, Button, Center, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import { updateQtyCartItem } from "../../services/customers/carts";

let debounceTimer;

function CartQuantity({ refetch, maxQty, quantity, cartItemId }) {
  const [count, setCount] = useState(quantity || 1);
  const [localCount, setLocalCount] = useState(quantity || 1);
  const toast = useToast();

  // Đồng bộ khi quantity prop thay đổi
  useEffect(() => {
    setCount(quantity || 1);
    setLocalCount(quantity || 1);
  }, [quantity]);

  // Debounce mutation
  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (count !== quantity) {
        mutate({ cartItemId, quantity: count });
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [count]);

  const { isLoading, mutate } = useMutation(updateQtyCartItem, {
    onError: () => {
      toast({
        title: "Lỗi!",
        description: "Không thể thay đổi số lượng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      refetch();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleChange = (delta) => {
    setLocalCount((prev) => prev + delta);
    setCount((prev) => prev + delta);
  };

  return (
    <Center>
      <Box display="flex" alignItems="center" gap="10px">
        <Button
          isLoading={isLoading}
          w="30px"
          h="30px"
          onClick={() => handleChange(-1)}
          isDisabled={count <= 1}
        >
          -
        </Button>
        <Button>{localCount}</Button>
        <Button
          isLoading={isLoading}
          w="30px"
          h="30px"
          onClick={() => handleChange(1)}
          isDisabled={count >= maxQty}
        >
          +
        </Button>
      </Box>
    </Center>
  );
}
CartQuantity.propTypes = {
  refetch: PropTypes.func.isRequired,
  maxQty: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  cartItemId: PropTypes.string.isRequired,
};

export default CartQuantity;

