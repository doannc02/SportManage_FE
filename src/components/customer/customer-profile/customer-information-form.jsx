import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import CoreInput from "../../atoms/CoreInput";
import CoreAutoComplete from "../../atoms/CoreAutoComplete";
import PropTypes from "prop-types";
import { MultiImageUploader } from "../../atoms/ImageUploader";
import { useFormContext } from "react-hook-form";
const CustomerInformationForm = () => {
  // const { control, avatarValue } = props;
  const { control, watch, setValue, getValues } = useFormContext();
  const avatarValue = watch("avatarUrl");  
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
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <>
          {" "}
          <GridItem colSpan={[12, 12]}>
            <Stack spacing={4}>
              <Text fontSize="sm" fontWeight="500">
                Ảnh đại diện
              </Text>

              {avatarValue ? (
                <Flex direction="column" gap={3}>
                  <Flex align="center" gap={3}>
                    <Avatar
                      src={`${avatarValue}`}
                      size="xl"
                      borderRadius="md"
                      bg="gray.100"
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
          </GridItem>
          <GridItem colSpan={[6, 6, 4]}>
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
          <GridItem colSpan={[6, 6, 4]}>
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
          <GridItem colSpan={[6, 6, 4]}>
            <CoreInput
              control={control}
              name="phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              required
              rules={{ required: "Trường này là bắt buộc!" }}
            />
          </GridItem>
          <GridItem colSpan={[6, 6, 4]}>
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
          <GridItem colSpan={[6, 6, 4]}>
            <CoreInput
              control={control}
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              rules={{
                required: "Trường này là bắt buộc!",
              }}
            />
          </GridItem>
          <GridItem colSpan={[6, 6, 4]}>
            <CoreInput
              control={control}
              name="ConfirmPassWord"
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
              type="password"
              rules={{
                required: "Trường này là bắt buộc!",
              }}
            />
          </GridItem>
          <GridItem colSpan={[6, 6, 4]}>
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
          <GridItem colSpan={[6, 6, 4]}>
            <CoreInput
              control={control}
              name="address"
              label="Địa chỉ nhà"
              placeholder="Nhập địa chỉ nhà"
              required
              rules={{ required: "Trường này là bắt buộc!" }}
            />
          </GridItem>
        </>
      </Grid>
    </>
  );
};
CustomerInformationForm.propTypes = {
  control: PropTypes.object.isRequired,
};

export default CustomerInformationForm;
