import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { UserContext } from "../Contexts/UserContext";
import CoreInput from "../components/atoms/CoreInput";
import { useForm } from "react-hook-form";
import { postLogin } from "../services/auth/login";
import { setAppToken } from "../configs/token";
import { UserContext } from "../Contexts/UserContext";
import { toastError, toastSuccess } from "../helpers/toast";
import { Images } from "../asserts/images";
import { DEFAULT_COLOR } from "../const/enum";
import { UAParser } from "ua-parser-js";
import { useQueryIPAddress, useQueryIPLocation } from "../services/common";
import { VITE_LOCATION_API_KEY } from "../configs/env";
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../hooks/usePushNotifications";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    username: "",
    password: "",
  });

  //query lấy data của địa chỉ ip và location của ip
  const { data: ipData } = useQueryIPAddress();
  const { data: locationData } = useQueryIPLocation({
    ipAddress: ipData,
    apiKey: VITE_LOCATION_API_KEY,
  });

  // thư viện UAParser để lấy thông tin thiết bị, trình duyệt và hệ điều hành
  const parser = new UAParser();
  const deviceInfo = parser.getResult();

  // Dữ liệu đăng nhập thiết bị
  const loginDeviceData = {
    browser: deviceInfo.browser.name + " " + deviceInfo.browser.version,
    os: deviceInfo.os.name + " " + deviceInfo.os.version,
    device: deviceInfo.device.model || "Thiết bị không xác định",
    ipAddress: ipData,
    loginTime: new Date().toISOString(),
    city: locationData?.city || "Không xác định",
    country: locationData?.countryNameNative || "Không xác định",
  };

  useEffect(() => {
    console.log("User Agent:", navigator.userAgent);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
      loginDevice: loginDeviceData,
    };

    try {
      const res = await postLogin(payload);
      console.log(payload, "payload");

      if (res.accessToken) {
        setAppToken(res);
        setUser({
          status: true,
          username: res.username,
          roles: res?.roles ?? [],
          totalCartItems: res?.totalCartItems,
        });
        toastSuccess("Đăng nhập thành công!");
        if (res.roles.includes("Admin")) {
          window.location.replace("/admin");
          return;
        }
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Đăng nhập lỗi:", error);
      toastError("Đăng nhập thất bại!");
      // Hiển thị lỗi cho người dùng nếu cần
      //alert("Lỗi đăng nhập. Vui lòng thử lại sau.")
    } finally {
      setLoading(false);
    }
  });

    const handleLoginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User info:", user);
      // TODO: Lưu user hoặc chuyển hướng
    } catch (error) {
      console.error("Login error:", error);
    }
  };
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
    <form onSubmit={onSubmit}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        direction={{ base: "column", md: "row" }}
        px={4}
      >
        <Stack
          spacing={5}
          mx={"auto"}
          maxW={"lg"}
          w={{ base: "100%", md: "50%" }}
          flex={1}
          justify="center"
          order={{ base: 1, md: 2 }}
        >
          <Stack align={"center"}>
            <Image src={Images.logo} w={150} h={150} />
            <Heading
              fontWeight={350}
              fontSize={{ base: "xl", md: "3xl" }}
              fontFamily={"mono"}
            >
              WELCOME TO BADMINTON STORE
            </Heading>
          </Stack>
          <Box
            rounded={"2xl"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            px={8}
            py={10}
            mx={3}
          >
            <Stack spacing={4}>
              <CoreInput
                label="User Name"
                required
                variant="outlined"
                rules={{
                  required: "Trường này không được để trống!",
                }}
                control={control}
                name="username"
              />
              <CoreInput
                sx={{ marginTop: "30px" }}
                variant="outlined"
                rules={{
                  required: "Trường này không được để trống!",
                }}
                required
                label="Password"
                type="password"
                control={control}
                name="password"
              />

              <Stack spacing={7}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Link to="/register">
                    <Text
                      color={"blue.400"}
                      _hover={{
                        textDecoration: "underline",
                      }}
                    >
                      Đăng ký tài khoản mới
                    </Text>
                  </Link>
                  <Link to="/ForgotPass">
                    <Text
                      color={"blue.400"}
                      _hover={{
                        textDecoration: "underline",
                      }}
                    >
                      Quên mật khẩu
                    </Text>
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Đang đăng nhập..."
                  rounded={"xl"}
                  bgColor={"#a2dbda"}
                  fontSize={"md"}
                  color={DEFAULT_COLOR}
                  variant={"outline"}
                  size={"lg"}
                >
                  ĐĂNG NHẬP
                </Button>
                <Button
                  // isLoading={isLoading}
                  loadingText="Đang đăng nhập..."
                  rounded={"xl"}
                  fontSize={"md"}
                  color={DEFAULT_COLOR}
                  onClick={handleLoginGoogle}
                  variant={"outline"}
                  size={"lg"}
                >
                  <span style={{ marginRight: "0.5rem" }}>
                    <FaGoogle />
                  </span>{" "}
                  Đăng nhập với Google
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
