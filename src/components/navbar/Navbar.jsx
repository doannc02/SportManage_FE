import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import TopNav from "./TopNav";
import Search from "./Search";
import Acount from "./Acount";
import Cart from "./Cart";
import Navmenu from "./Navmenu";
import Popsearch from "./Popsearch";
// import { Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderPopover from "./order-popover";

function Navbar() {
  const cartRef = useRef();
  const btnRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(UserContext);
  const [num, setNum] = useState(0);
  const navigate = useNavigate();
  function handleClickLogo() {
    navigate("/");
  }

  function handleCartClick(e) {
    e.preventDefault();
    navigate("/cartpage");
  }

  useEffect(() => {
    setNum(user.totalCartItems);
  }, [user.totalCartItems]);

  return (
    <Flex
      zIndex="999"
      w="100%"
      bg="white"
      flexDir="column"
      boxShadow="0 2px 8px rgba(0,0,0,0.07)"
      position="sticky"
      top="0"
    >
      {/* <TopNav /> */}
      {/* Mobile Navbar */}
      <Flex
        display={{ base: "flex", md: "flex", lg: "none" }}
        px={4}
        py={2}
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid #eee"
        bg="white"
      >
        <Flex alignItems="center" gap={2}>
          <Navmenu
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            btnRef={btnRef}
            key={location.pathname} 
          />
          <Popsearch />
        </Flex>
        <Flex alignItems="center" gap={4}>
          <Acount />
          {/* <Box as="span" onClick={handleCartClick} cursor="pointer">
            <Cart ref={cartRef} num={num} />
          </Box> */}
        </Flex>
      </Flex>
      {/* Desktop Navbar */}
      <Box
        display={{ base: "none", lg: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        px={10}
        py={2}
        borderBottom="1.5px solid #f0f0f0"
        bg="white"
      >
        <Flex
          alignItems="center"
          flexDirection={"column"}
          cursor="pointer"
          onClick={handleClickLogo}
          gap={2}
        >
          <Text
            fontWeight="bold"
            fontSize="2.5rem"
            color="#2e3337"
            letterSpacing="1px"
            lineHeight="1"
            fontFamily="Montserrat, sans-serif"
          >
            BadmintonStore
          </Text>
          <Text fontSize="sm" color="#888" ml={2}>
            part of the LOOKFANTASTIC group
          </Text>
        </Flex>
        <Box w="40%">
          <Search />
        </Box>
        <Flex alignItems="center" gap={6}>
          <Box as="span" onClick={handleCartClick} cursor="pointer">
            <Cart ref={cartRef} num={num} />
          </Box>
          <Box as="span" onClick={() => navigate("/order")} cursor="pointer">
            <OrderPopover />
          </Box>{" "}
          <Acount />
        </Flex>
      </Box>
    </Flex>
  );
}

export default Navbar;
