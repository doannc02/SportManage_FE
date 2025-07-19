import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import CoreInput from "../../atoms/CoreInput";
import CoreAutoComplete from "../../atoms/CoreAutoComplete";
import PropTypes from "prop-types";
import { MultiImageUploader } from "../../atoms/ImageUploader";
import { useFormContext } from "react-hook-form";
import { Avatar } from "antd";
import { ShoppingBag, SquareUser, Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CustomerInformationForm = () => {
  const { control, watch, setValue, getValues } = useFormContext();
  const avatarValue = watch("avatarUrl");
  const navigate = useNavigate();
  
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Text fontSize="lg" fontWeight="bold">
          Thông tin khách hàng
        </Text>
      </Box>
      <>
        <Flex gap={10} flexDirection={["column", "column", "row"]}>
          {" "}
          <Stack spacing={4} w={["100%", "100%", "20%"]}>
            {avatarValue ? (
              <Flex direction="column" gap={3}>
                <Flex align="center" gap={3} flexDirection={"column"}>
                  <Avatar
                    src={`${avatarValue}`}
                    size={200}
                    style={{
                      border: "4px solid #319795",
                      boxShadow: "0 4px 16px rgba(49,151,149,0.15)",
                      background: "#e6fffa",
                    }}
                  />
                  <Stack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setValue("avatarUrl", "")}
                    >
                      Xóa ảnh đại diện
                    </Button>
                  </Stack>
                </Flex>
              </Flex>
            ) : (
              <Box>
                <MultiImageUploader
                  name="avatarUrl"
                  label=""
                  height="45px"
                  hideLabel
                  defaultValue={getValues(`avatarUrl`)}
                  onChange={(urls) => setValue(`avatarUrl`, urls[0])}
                  maxFiles={1}
                />
              </Box>
            )}
          </Stack>
          <Grid
            w={["100%", "100%", "80%"]}
            templateColumns="repeat(12, 1fr)"
            gap={[4, 4, 10]}
          >
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                readOnly
                control={control}
                name="userName"
                label="Tên người dùng"
                placeholder="Nhập tên người dùng"
                required
                rules={{ required: "Trường này là bắt buộc!" }}
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                control={control}
                name="email"
                label="Email"
                placeholder="Nhập email"
                required
                type="email"
                rules={{
                  required: "Trường này là bắt buộc!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                }}
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                control={control}
                name="phone"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                required
                rules={{ required: "Trường này là bắt buộc!" }}
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreAutoComplete
                options={[
                  { value: "Male", label: "Nam" },
                  { value: "Female", label: "Nữ" },
                  { value: "Other", label: "Khác" },
                ]}
                control={control}
                valuePath="value"
                required
                rules={{ required: "Trường này là bắt buộc!" }}
                name="gender"
                label="Giới tính"
                placeholder="Chọn giới tính"
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                control={control}
                name="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                type="password"
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                control={control}
                name="ConfirmPassWord"
                label="Xác nhận mật khẩu"
                placeholder="Xác nhận mật khẩu"
                type="password"
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                control={control}
                name="age"
                label="Tuổi"
                placeholder="Nhập tuổi"
                type="number"
                rules={{
                  required: "Trường này là bắt buộc!",
                  min: {
                    value: 1,
                    message: "Tuổi phải lớn hơn 0",
                  },
                  max: {
                    value: 100,
                    message: "Tuổi không hợp lệ",
                  },
                }}
              />
            </GridItem>
            <GridItem colSpan={[12, 12, 6]}>
              <CoreInput
                control={control}
                name="address"
                label="Địa chỉ nhà"
                placeholder="Nhập địa chỉ nhà"
                required
                rules={{ required: "Trường này là bắt buộc!" }}
              />
            </GridItem>
            <GridItem
              colSpan={[12]}
              justifyContent={"space-between"}
              alignItems="center"
              display={{ base: "none", md: "flex" }}
            >
              <Box display="flex" gap={5} alignItems="center">
                <VStack align="flex-start" spacing={2}>
                  <HStack flexWrap="wrap">
                    <Text fontSize={"md"} fontWeight="bold">
                      Vai trò:{" "}
                    </Text>
                    <Box
                      bg="gray.100"
                      color="teal.700"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontWeight="semibold"
                      fontSize="sm"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <SquareUser size={18} />
                      Khách hàng
                    </Box>
                  </HStack>
                  <Text fontSize="md" color="gray.600">
                    Điểm thành viên: <b>750</b>
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Tham gia từ: 02/07/2025
                  </Text>
                </VStack>
              </Box>

              {/* Right section: Stats + Button */}
              <Box w="full" maxW={{ md: "280px" }}>
                <Box
                  w="full"
                  textAlign="left"
                  p={4}
                  bg="teal.50"
                  borderRadius="lg"
                  boxShadow="sm"
                  display={{ base: "none", md: "block" }}
                >
                  <Box display="flex" alignItems="center" mb={2} gap={2}>
                    <Text fontWeight="bold" color="teal.700">
                      Thông tin mua hàng
                    </Text>
                    <Tags size={23} strokeWidth={1.5} />
                  </Box>
                  <VStack align="flex-start" spacing={1}>
                    <Text fontSize="sm">
                      <b>Số đơn hàng đã mua:</b>15
                    </Text>
                    <Text fontSize="sm">
                      <b>Số địa chỉ đã lưu:</b>5
                    </Text>
                  </VStack>
                </Box>

                <Button
                  mt={3}
                  variant="ghost"
                  rightIcon={<ShoppingBag size={20} strokeWidth={1.5} />}
                  onClick={() => navigate("/")}
                  colorScheme="teal"
                  size={{ base: "sm", md: "md" }}
                  w="full"
                >
                  Đi đến trang mua hàng
                </Button>
              </Box>
            </GridItem>
          </Grid>
        </Flex>
      </>
    </>
  );
};
CustomerInformationForm.propTypes = {
  control: PropTypes.object.isRequired,
};

export default CustomerInformationForm;
