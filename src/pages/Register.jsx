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
import { UserContext } from "../Contexts/UserContext";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { saveUser } from "../services/admins/users";
import CoreInput from "../components/atoms/CoreInput";
import { useForm, Controller } from "react-hook-form";
import CoreAutoComplete from "../components/atoms/CoreAutoComplete";
import { DEFAULT_COLOR } from "../const/enum";
import { upperCase } from "lodash";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const defaultValues = {
  userName: "",
  email: "",
  password: "",
  gender: "Male",
  age: "",
  phone: "",
  address: "",
};
export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues,
  });

  const { mutate, isLoading } = useMutation(saveUser, {
    onSuccess: () => {
      toast({
        title: "Register successfully.",
        description: "We've created your account for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      reset(defaultValues);
      navigate("/login");
    },
    onError: (error) => {
      toast({
        title: "Register failed.",
        description: error?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (values) => {
    mutate({
      input: {
        ...values,
        age: Number(values.age) || 0,
      },
      method: "post",
    });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={5} mx={"auto"} maxW={"lg"} w="100%">
        <Box
          rounded={"2xl"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Heading
              fontWeight={350}
              fontSize={{ base: "xl", md: "3xl" }}
              fontFamily={"mono"}
            >
              Đăng ký tài khoản mới
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={5}>
                <CoreInput
                  control={control}
                  name="userName"
                  label="User Name"
                  placeholder="Enter your user name"
                  rules={{ required: "User name is required" }}
                />
                <CoreInput
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  rules={{
                    required: "Trường này là bắt buộc",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Nhập email hợp lệ",
                    },
                  }}
                />
                <CoreInput
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  rules={{ required: "Trường này là bắt buộc" }}
                />
                <CoreAutoComplete
                  control={control}
                  name="gender"
                  label="Giới tính"
                  options={genderOptions}
                  placeholder="Chọn giới tính"
                  rules={{ required: "Trường này là bắt buộc" }}
                />
                <CoreInput
                  control={control}
                  name="age"
                  label="Age"
                  placeholder="Enter your age"
                  type="number"
                  rules={{
                    required: "Age is required",
                    min: { value: 0, message: "Age must be at least 0" },
                    max: {
                      value: 100,
                      message: "Tuổi không hợp lệ",
                    },
                  }}
                />
                <CoreInput
                  control={control}
                  name="phone"
                  label="Phone"
                  placeholder="Enter your phone number"
                  rules={{ required: "Trường này là bắt buộc" }}
                />
                <CoreInput
                  control={control}
                  name="address"
                  label="Địa chỉ"
                  placeholder="Enter your address"
                  rules={{ required: "Trường này là bắt buộc" }}
                />
                <Button
                  type="submit"
                  rounded={"xl"}
                  bgColor={"#a2dbda"}
                  fontSize={"md"}
                  color={DEFAULT_COLOR}
                  variant={"outline"}
                  size={"lg"}
                  isLoading={isLoading || isSubmitting}
                  loadingText="Đang đăng ký..."
                  mt={2}
                >
                  ĐĂNG KÝ
                </Button>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={"center"}>
                Đã có tài khoản?{" "}
                <Link to="/login">
                  <Text
                    as="span"
                    color={"blue.400"}
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    Đăng nhập tại đây
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
