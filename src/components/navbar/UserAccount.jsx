import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
// import Admin from "../../Pages/Admin";
// import { useAuth } from "../../Utilis/Auth";
import NavStyle from "./navbar.module.css";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";
import { postLogout } from "../../services/auth/logout";
import { getAppToken, removeAppToken } from "../../configs/token";
import { logoutAccount } from "../../configs/axios";





function UserAccount() {

  const navigate = useNavigate();
  const tokenApp = getAppToken()
  console.log(tokenApp);
  
  const { user, setUser } = useContext(UserContext);
  //   const { logout } = useAuth();


  return (
    <Popover trigger="hover" placement="bottom-end">
      <PopoverTrigger>
        <Flex
          alignItems="center"
          gap="8px"
          cursor="pointer"
          px={3}
          py={2}
          borderRadius="md"
          _hover={{ bg: "teal.50", boxShadow: "md" }}
          className={NavStyle.userAccountTrigger}
        >
          <Box
            bg="teal.500"
            color="white"
            borderRadius="full"
            p={1.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <RxPerson size="22px" />
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
        <PopoverHeader
          pt="36px"
          pb="2"
          bg="teal.50"
          borderTopRadius="lg"
          fontWeight="bold"
          fontSize="lg"
          color="teal.700"
        >
          Tài khoản
        </PopoverHeader>
        <PopoverBody p={5}>
          <Flex flexDir="column" gap={3}>
            <Text fontWeight="semibold" color="gray.700">
              Tên: <Box as="span" color="teal.600">{tokenApp.username}</Box>
            </Text>
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
