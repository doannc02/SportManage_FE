import {
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import CartTable from "../../../components/cart/CartTable";
import { Link } from "react-router-dom";


function CartPage() {
  return (
    <Box mt="15px" p={{ lg: "50px", md: "40px", sm: "10px", base: "10px" }}>
      <Flex mb="20px" alignItems="center" justifyContent="space-between">

        {/* <Button color="white" bg="black">
          <BsFillShieldLockFill />
          <Text ml="5px">CHECKOUT SECURELY NOW</Text>
        </Button> */}
      </Flex>
      <CartTable />

      <Flex my="20px" alignItems="center" justifyContent="space-between">
        <Link to={"/productpage"}>
          <Button>Continue Shopping</Button>
        </Link>
        {/* <Link to={"/CreditCardForm"}>
          <Button color="white" bg="black">
            <BsFillShieldLockFill />
            <Text ml="5px">CHECKOUT SECURELY NOW</Text>
          </Button>
        </Link> */}
      </Flex>
    </Box>
  );
}

export default CartPage;
