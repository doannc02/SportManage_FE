import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { RxPerson } from "react-icons/rx";
import { Link } from "react-router-dom";
import NavStyle from "./navbar.module.css";
import { getAppToken } from "../../configs/token";
import { logoutAccount } from "../../configs/axios";
import { House, PackageCheck, Settings, UserRound } from "lucide-react";
import { DEFAULT_COLOR } from "../../const/enum";
import { useQueryInfoCurrentCustomer } from "../../services/customers/current-infos";
import { Avatar } from "antd";
import { useEffect, useState } from "react";

function UserAccount() {
  const tokenApp = getAppToken();
  const { data } = useQueryInfoCurrentCustomer();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 ? true : false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //   const { logout } = useAuth();
  const menuItems = [
    { label: "Trang chủ", icon: <House strokeWidth={1} />, link: "/" },
    {
      label: "Đơn hàng",
      icon: <PackageCheck strokeWidth={1} />,
      link: "/order",
    },
    {
      label: "Cá nhân",
      icon: <UserRound strokeWidth={1} />,
      link: "/customer-profile",
    },
    {
      label: "Cài đặt",
      icon: <Settings strokeWidth={1} />,
      link: "/settings",
    },
  ];
  if (isMobile) {
    return (
      <Flex
        alignItems="center"
        gap="8px"
        cursor="pointer"
        px={3}
        py={2}
        borderRadius="md"
        className={NavStyle.userAccountTrigger}
      >
        <Box
          bg={data?.avatarUrl ? "" : "teal.500"}
          color="white"
          borderRadius="full"
          p={data.avatarUrl ? 0 : 1.5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* <RxPerson size="22px" /> */}
          {data?.avatarUrl ? (
            <Avatar size={50} src={data?.avatarUrl} />
          ) : (
            <RxPerson size="22px" />
          )}
        </Box>
        <Text
          fontWeight="medium"
          fontSize="md"
          display={{ lg: "block", md: "none", sm: "none", base: "none" }}
        >
          {tokenApp.username}
        </Text>
      </Flex>
    );
  }
  return (
    <Popover trigger="hover" placement="bottom-end">
      <PopoverTrigger>
        <Flex
          alignItems="center"
          gap="8px"
          cursor="pointer"
          px={3}
          py={2}
          className={NavStyle.userAccountTrigger}
        >
          <Box
            bg={data?.avatarUrl ? "" : "teal.500"}
            color="white"
            borderRadius="full"
            p={data?.avatarUrl ? 0 : 1.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* <RxPerson size="22px" /> */}
            {data?.avatarUrl ? (
              <Avatar size={50} src={data?.avatarUrl} />
            ) : (
              <RxPerson size="22px" />
            )}
          </Box>
          <Text
            fontWeight="medium"
            fontSize="md"
            display={{ lg: "block", md: "none", sm: "none", base: "none" }}
          >
            {tokenApp.username}
          </Text>
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        w="250px"
        borderRadius="lg"
        boxShadow="lg"
        p={0}
        bg="white"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody p={5}>
          <Flex flexDir="column" gap={3}>
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
            </Flex>
            <Button
              colorScheme="teal"
              variant="solid"
              mt={2}
              borderRadius="md"
              onClick={() => {
                logoutAccount();
              }}
              _hover={{ bg: "teal.600" }}
            >
              Đăng xuất
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default UserAccount;
