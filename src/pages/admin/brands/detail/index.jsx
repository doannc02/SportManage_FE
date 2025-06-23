import { Box, Button, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import { useDetailBrands } from "./useDetailBrands";
import CoreAutoComplete from "../../../../components/atoms/CoreAutoComplete";
import { countiesCitiesEnums, isActiveBrands } from "../../../../const/enum";
import { useQueryAddressLv1 } from "../../../../services/common";
import { Avatar, Flex } from "antd";
import { MultiImageUploader } from "../../../../components/atoms/ImageUploader";
import { BASE_URL } from "../../../../configs/auth";
import CoreDatePicker from "../../../../components/atoms/CoreDatePicker";

const BrandsDetailAdmin = () => {
  const { data: dataAddressLv1, isLoading: isLoadingAddressLv1 } =
    useQueryAddressLv1();
  const [{ methodForm, isLoadingSubmit, isEdit }, { onSubmit }] =
    useDetailBrands();

  const logoValue = methodForm.watch("logoUrl");

  const getCityByCountry = () => {
    const selectedCountryId = methodForm.watch("countryId");

    if (selectedCountryId === "vietnam") {
      return (dataAddressLv1?.data ?? []).map((item) => ({
        value: item.id,
        label: item.full_name,
      }));
    } else if (selectedCountryId) {
      const country = countiesCitiesEnums.find(
        (item) => item.value === selectedCountryId
      );
      return country?.cities ?? [];
    }
    return [];
  };

  // Regex for http or https URLs
  const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

  return (
    <form onSubmit={onSubmit}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={[12, 12]}>
          <Stack spacing={4}>
            <Text fontSize="sm" fontWeight="500">
              Logo brands
            </Text>

            {logoValue ? (
              <Flex direction="column" gap={3}>
                <Flex align="center" gap={3}>
                  <Avatar
                    src={`${logoValue}`}
                    size="xl"
                    borderRadius="md"
                    bg="gray.100"
                  />
                  <Stack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => methodForm.setValue("logoUrl", "")}
                    >
                      Xóa logo
                    </Button>
                  </Stack>
                </Flex>
              </Flex>
            ) : (
              <Box>
                <MultiImageUploader
                  name="logoUrl"
                  label=""
                  height="45px"
                  hideLabel
                  defaultValue={methodForm.getValues(`logoUrl`)}
                  onChange={(urls) => methodForm.setValue(`logoUrl`, urls[0])}
                  maxFiles={1}
                />
              </Box>
            )}
          </Stack>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <CoreInput
            control={methodForm.control}
            name="name"
            label="Tên thương hiệu"
            placeholder="Nhập tên thương hiệu"
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <CoreInput
            control={methodForm.control}
            name="slug"
            label="Slug"
            placeholder="Nhập slug"
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <CoreAutoComplete
            options={(countiesCitiesEnums ?? []).map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            control={methodForm.control}
            name="countryId"
            label="Quốc gia"
            valuePath="value"
            labelPath="label"
            required
            rules={{ required: "Trường này là bắt buộc!" }}
            placeholder="Chọn quốc gia"
            onChangeValue={(value) => {
              methodForm.setValue("country", value);
            }}
          />
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <CoreAutoComplete
            loading={
              methodForm.watch("countryId") === "vietnam"
                ? isLoadingAddressLv1
                : false
            }
            options={getCityByCountry()}
            control={methodForm.control}
            name="city"
            label="Tỉnh/Thành phố"
            required
            rules={{ required: "Trường này là bắt buộc!" }}
            placeholder="Chọn tỉnh/thành phố"
          />
        </GridItem>

        <GridItem colSpan={[6, 6]}>
          <CoreInput
            control={methodForm.control}
            name="website"
            label="Website"
            placeholder="Nhập địa chỉ website"
            required
            rules={{
              required: "Trường này là bắt buộc",
              pattern: {
                value: urlRegex,
                message:
                  "Website phải là đường dẫn hợp lệ (http:// hoặc https://)",
              },
            }}
          />
        </GridItem>

        <GridItem colSpan={[6, 6]}>
          <CoreInput
            control={methodForm.control}
            name="foundedYear"
            label="Năm thành lập"
            placeholder="Năm thành lập"
            type={"number"}
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <CoreAutoComplete
            options={(isActiveBrands ?? []).map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            control={methodForm.control}
            name="isActive"
            label="Doanh nghiệp còn hoạt động hay không?"
            placeholder="Chọn 1 trong 2 lựa chọn"
          />
        </GridItem>
        <GridItem colSpan={[12, 12]}>
          <CoreInput
            control={methodForm.control}
            name="descriptions"
            label="Mô tả"
            placeholder="Nhập mô tả"
            multiline
          />
        </GridItem>
        <GridItem colSpan={12}>
          <Box display="flex" justifyContent="center">
            <Button
              isLoading={isLoadingSubmit}
              colorScheme="teal"
              size="lg"
              type="submit"
            >
              {isEdit ? "Cập nhật brands" : "Tạo mới brands"}
            </Button>
          </Box>
        </GridItem>
      </Grid>
    </form>
  );
};

export default BrandsDetailAdmin;
