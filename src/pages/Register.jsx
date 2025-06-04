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
}
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
    defaultValues
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
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Heading fontSize="2xl" textAlign="center" mb={2}>
              Register Account
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
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                />
                <CoreInput
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  rules={{ required: "Password is required" }}
                />
                <CoreAutoComplete
                  control={control}
                  name="gender"
                  label="Gender"
                  options={genderOptions}
                  placeholder="Select gender"
                  rules={{ required: "Gender is required" }}
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
                      message: "Tuổi không hợp lệ"
                    }
                  }}
                />
                <CoreInput
                  control={control}
                  name="phone"
                  label="Phone"
                  placeholder="Enter your phone number"
                  rules={{ required: "Phone is required" }}
                />
                <CoreInput
                  control={control}
                  name="address"
                  label="Address"
                  placeholder="Enter your address"
                  rules={{ required: "Address is required" }}
                />
                <Button
                  type="submit"
                  fontWeight="600"
                  bgColor="black"
                  color="white"
                  borderRadius="0"
                  _hover={{ bg: "cyan.500" }}
                  isLoading={isLoading || isSubmitting}
                  loadingText="Registering..."
                  mt={2}
                >
                  SIGN UP
                </Button>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link to="/login">
                  <Text as="span" color={"blue.400"}>Login</Text>
                </Link>
              </Text>
              <Text align={"center"} fontSize="sm" color="gray.500">
                By proceeding, you are confirming that you agree to our{" "}
                <strong>Terms and Conditions</strong> and{" "}
                <strong>Privacy Policy</strong>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
