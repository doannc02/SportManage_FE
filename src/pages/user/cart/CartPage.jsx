import { Box, Button, Flex} from "@chakra-ui/react";
import CartTable from "../../../components/cart/CartTable";
import { Link } from "react-router-dom";

function CartPage() {
  return (
    <Box mt="15px" p={{ lg: "50px", md: "40px", sm: "10px", base: "10px" }}>
      <Flex mb="20px" alignItems="center" justifyContent="space-between"></Flex>
      <CartTable />

      <Flex my="20px" alignItems="center" justifyContent="space-between">
        <Link to={"/productpage"}>
          <Button>Continue Shopping</Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default CartPage;
