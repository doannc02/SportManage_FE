import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { DEFAULT_COLOR } from "../const/enum";

export default function ForgotPass() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(otp);
    axios
      .post("https://BadmintonStore.onrender.com/user/forgot", { email: otp })
      .then((res) => {
        console.log(res.data);
        if (res.error) {
          throw new Error(res.message);
        }
        toast({
          title: "OTP sent.",
          description: "We've sent OTP to your email..",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate("/ForgotVerification");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Something went wrong!",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Flex
      minH={"50vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={5} mx={"auto"} maxW={"lg"} w="100%">
        <Stack align={"center"}>
          <Heading fontWeight={350} fontSize={"4xl"}>
            {/* Existing Customers */}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="otp">
              <FormLabel>Vui lòng nhập email của bạn</FormLabel>
              <Input type="text" onChange={(e) => setOtp(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Button
                onClick={handleLogin}
                rounded={"xl"}
                bgColor={"#a2dbda"}
                fontSize={"md"}
                color={DEFAULT_COLOR}
                variant={"outline"}
                size={"lg"}
                isLoading={loading}
                loadingText="Verifying..."
              >
                Submit
              </Button>
              <Text align={"center"}>
                Sau khi gửi hoàn tất,{" "}
                <Link to="/login">
                  <Text
                    as="span"
                    color={"blue.400"}
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    đăng nhập tại đây
                  </Text>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
