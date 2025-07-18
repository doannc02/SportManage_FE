import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Flex,
  Image,
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  BaggageClaim,
  House,
  LogOut,
  PackageCheck,
  Settings,
  UserRound,
} from "lucide-react";
import { Badge } from "antd";
import { useLocation } from "react-router-dom";
import { DEFAULT_COLOR } from "../../const/enum";
import { Images } from "../../asserts/images";
import { logoutAccount } from "../../configs/axios";
import PropTypes from "prop-types";

// Move useDisclosure to a parent component (e.g., Layout) and pass as props to Navmenu
function Navmenu({ isOpen, onOpen, onClose, btnRef, countItems }) {
  const menuItems = [
    { label: "Trang chủ", icon: <House strokeWidth={1} />, link: "/" },
    {
      label: "Giỏ hàng",
      icon: (
        <Badge count={countItems}>
          <BaggageClaim strokeWidth={1} />
        </Badge>
      ),
      link: "/cartpage",
    },
    {
      label: "Danh sách đơn hàng",
      icon: <PackageCheck strokeWidth={1} />,
      link: "/order",
    },
    {
      label: "Trang thông tin cá nhân",
      icon: <UserRound strokeWidth={1} />,
      link: "/customer-profile",
    },
    {
      label: "Thiết bị",
      icon: <Settings
       strokeWidth={1} />,
      link: "/settings",
    },
  ];

  const location = useLocation();

  return (
    <>
      <Box ref={btnRef} className="cursor-pointer" onClick={onOpen}>
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
          <DrawerHeader
            borderBottomWidth="1px"
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            gap={2}
          >
            <Image src={Images.logo} className="h-20 w-20" />
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
                    color={
                      location.pathname === item.link
                        ? DEFAULT_COLOR
                        : "gray.700"
                    }
                    bg={
                      location.pathname === item.link
                        ? "green.50"
                        : "transparent"
                    }
                    _hover={{ bg: "green.50", color: DEFAULT_COLOR }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Button
                variant="ghost"
                w="100%"
                onClick={() => {
                  logoutAccount();
                }}
                justifyContent="flex-start"
                leftIcon={<LogOut strokeWidth={1} />}
                fontWeight="medium"
                fontSize="md"
                color={"gray.700"}
                bg={"transparent"}
                _hover={{ bg: "green.50", color: DEFAULT_COLOR }}
              >
                Đăng xuất
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
Navmenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  btnRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  countItems: PropTypes.number,
};

export default Navmenu;
