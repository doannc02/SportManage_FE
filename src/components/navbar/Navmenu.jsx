import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiFillHome } from "react-icons/ai";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BaggageClaim, House, PackageCheck } from "lucide-react";

// Move useDisclosure to a parent component (e.g., Layout) and pass as props to Navmenu
function Navmenu({ isOpen, onOpen, onClose, btnRef }) {
  const menuItems = [
    { label: "Trang chủ", icon: <House strokeWidth={1} />, link:"/" },
    { label: "Giỏ hàng", icon: <BaggageClaim strokeWidth={1} />, link:"/cartpage" },
    { label: "Danh sách đơn hàng", icon: <PackageCheck strokeWidth={1} />, link:"/order" },
  ];

  return (
    <>
      <Box ref={btnRef}  className="cursor-pointer" onClick={onOpen}>
        <RxHamburgerMenu />
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton mt={2} />
          <DrawerHeader borderBottomWidth="1px" display="flex" alignItems="center" gap={2}>
            <AiFillHome size={28} color="#3182CE" />
            <Text fontWeight="bold" fontSize="xl" color="gray.700">SportManage</Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Flex direction="column" gap={2} mt={4}>
              {menuItems.map((item) => (
                <Link to={item?.link} key={item.label}>
                  <Button
                    variant="ghost"
                    w="100%"
                    justifyContent="flex-start"
                    leftIcon={item?.icon}
                    fontWeight="medium"
                    fontSize="md"
                    color="gray.700"
                    _hover={{ bg: "blue.50", color: "blue.600" }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Flex>
          </DrawerBody>
          {/* <DrawerFooter bg="#f9f9f9" borderTopWidth="1px">
            <Flex
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              py={2}
            >
              <Image
                w="36px"
                h="36px"
                border="2px solid #3182CE"
                borderRadius="full"
                src="/logo192.png"
                alt="Logo"
                bg="white"
              />
              <Button
                variant="link"
                color="blue.500"
                fontWeight="semibold"
                fontSize="md"
                textDecor="underline"
                _hover={{ color: "blue.700" }}
              >
                Change Language
              </Button>
            </Flex>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Navmenu;
