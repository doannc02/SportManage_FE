import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Button,
  Text,
} from "@chakra-ui/react";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import UserAccount from "./UserAccount";
import { getAppToken } from "../../configs/token";
function Acount() {
  const navigate = useNavigate();

  const tokenApp = getAppToken();

  if (tokenApp) {
    return (<UserAccount />)
  }


  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Flex alignItems="center" gap="10px">
          <RxPerson size="20px" ml="" />{" "}
          <Text
            display={{ lg: "initial", md: "none", sm: "none", base: "none" }}
          >
            Account
          </Text>
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader pt="40px" bg="#f9f9f9">
          <Flex flexDir="column" rowGap="20px">
            <Button
              onClick={() => navigate("/login")}
              colorScheme="blackAlpha"
              variant="solid"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              colorScheme="black"
              variant="outline"
            >
              Sign Up
            </Button>
          </Flex>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

export default Acount;
