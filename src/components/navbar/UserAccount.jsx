import { Flex, Box, Text } from "@chakra-ui/react";
import { RxPerson } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import NavStyle from "./navbar.module.css";
import { getAppToken } from "../../configs/token";
import { logoutAccount } from "../../configs/axios";
import { House, LogOut, PackageCheck, Settings, UserRound } from "lucide-react";
import { DEFAULT_COLOR } from "../../const/enum";
import { useQueryInfoCurrentCustomer } from "../../services/customers/current-infos";
import { Avatar, Button, ConfigProvider, Divider, Dropdown } from "antd";
import React, { useEffect, useState } from "react";

function UserAccount() {
  const tokenApp = getAppToken();
  const { data } = useQueryInfoCurrentCustomer();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 ? true : false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const menuItems = [
    {
      label: "Trang chủ",
      icon: <House strokeWidth={1} size={19} />,
      key: "/",
    },
    {
      label: "Đơn hàng",
      icon: <PackageCheck strokeWidth={1} size={19} />,
      key: "/order",
    },
    {
      label: "Cá nhân",
      icon: <UserRound strokeWidth={1} size={19} />,
      key: "/customer-profile",
    },
    {
      label: "Thiết bị",
      icon: <Settings strokeWidth={1} size={19} />,
      key: "/settings",
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
          p={data?.avatarUrl ? 0 : 1.5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
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
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: DEFAULT_COLOR,
            controlItemBgActive: "#d5f0ef",
            controlItemBgActiveHover: "rgba(213, 240, 239)",
          },
        }}
      >
        <Dropdown
          menu={{
            items: menuItems,
            selectable: true,
            defaultSelectedKeys: [location.pathname],
            onClick: (e) => navigate(e.key),
          }}
          popupRender={(menu) => (
            <div>
              {React.cloneElement(menu)}
              <Divider style={{ margin: 0 }} />
              <div style={{ padding: 4 }}>
                <Button
                  onClick={() => logoutAccount()}
                  icon={<LogOut strokeWidth={1} size={15} />}
                  type="primary"
                  size="large"
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          )}
        >
          <Box
            onClick={(e) => e.preventDefault()}
            bg={data?.avatarUrl ? "" : "teal.500"}
            color="white"
            borderRadius="full"
            p={data?.avatarUrl ? 0 : 1.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {data?.avatarUrl ? (
              <Avatar size={50} src={data?.avatarUrl} />
            ) : (
              <RxPerson size="22px" />
            )}
          </Box>
        </Dropdown>
      </ConfigProvider>
    </>
  );
}

export default UserAccount;
