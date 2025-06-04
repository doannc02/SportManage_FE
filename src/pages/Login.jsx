import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { UserContext } from "../Contexts/UserContext";
import CoreInput from "../components/atoms/CoreInput";
import { useForm } from "react-hook-form";
import { postLogin } from "../services/auth/login";
import { setAppToken } from "../configs/token";
import { UserContext } from "../Contexts/UserContext";
import { toastError, toastSuccess } from "../helpers/toast";
// import jwt from "jsonwebtoken";
export default function Login() {

  const { setUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({
    username: '',
    password: ''
  })


  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    try {
      const res = await postLogin(data.username, data.password)
      if (res.accessToken) {
        setAppToken(res)
        setUser({
          status: true,
          username: res.username,
          roles: res?.roles ?? [],
          totalCartItems: res?.totalCartItems,
        })
        toastSuccess("Đăng nhập thành công!")
        if (res.roles.includes('Admin')) {
          window.location.replace("/admin")
          return
        }
        window.location.replace("/")
      }
    } catch (error) {
      console.error("Đăng nhập lỗi:", error)
      toastError("Đăng nhập thất bại!")
      // Hiển thị lỗi cho người dùng nếu cần
      //alert("Lỗi đăng nhập. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  })

  // const logingin = async () => {
  //   setLoading(true);
  //   axios
  //     .post("https://BadmintonStore.onrender.com/user/login", user, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       // console.log(res);
  //       user.status = true;
  //       user.name = res.data.userDetail.name;
  //       user.id = res.data.userDetail._id;
  //       localStorage.setItem("userStatus", JSON.stringify(user.status));
  //       navigate("/");
  //       setLoading(false);
  //       console.log(res.data.userDetail);
  //       console.log(user);
  //     })
  //     .catch((err) => {
  //       localStorage.setItem("userStatus", JSON.stringify(true));
  //       navigate("/");
  //       alert("Invalid Credentials");
  //       setLoading(false);
  //       console.log(err);
  //     });
  // };

  return (
    <form onSubmit={onSubmit} >
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={5} mx={"auto"} maxW={"lg"} w="100%">
          <Stack align={"center"}>
            <Heading fontWeight={350} fontSize={"4xl"}>
              WELCOME!
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>

              <CoreInput label='username' required variant='outlined' rules={{
                required: "Trường này không được để trống!"
              }} control={control} name='username' />
              <CoreInput sx={{ marginTop: '30px' }} variant='outlined' rules={{
                required: "Trường này không được để trống!",
              }} required label='password' type='password' control={control} name='password' />

              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Link to="/register">
                    <Text color={"blue.400"}> New Customer?</Text>
                  </Link>
                  <Link to="/ForgotPass" >
                    <Text color={"blue.400"}>Forgot Password?</Text>
                  </Link>
                </Stack>
                <Button
                  type="submmit"
                  //onClick={handleLogin}
                  fontWeight="600"
                  bgColor="black"
                  color="white"
                  borderRadius="0"
                  _hover={{
                    bg: "cyan.500",
                  }}
                  isLoading={isLoading}
                  loadingText="Loging in..."
                >
                  LOGIN
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
