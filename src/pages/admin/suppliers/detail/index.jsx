import { Box, Button, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import { useDetailSuppliers } from "./useDetailSuppliers";
import CoreAutoComplete from "../../../../components/atoms/CoreAutoComplete";
import { countiesCitiesEnums, isActiveBrands } from "../../../../const/enum";
import {
  useQueryAddressLv1,
  useQueryAddressLv2,
} from "../../../../services/common";

const SuppliersDetailAdmin = () => {
  const { data: dataAddressLv1, isLoading: isLoadingAddressLv1 } =
    useQueryAddressLv1();
//   const selectedCity = methodForm.watch("city");
//   const { data: dataAddressLv2, isLoading: isLoadingAddressLv2 } =
//     useQueryAddressLv2(selectedCity ? selectedCity : []);

  const [{ methodForm, isLoadingSubmit, isEdit }, { onSubmit }] =
    useDetailSuppliers();

  const getCityByCountry = () => {
    const selectedCountry = methodForm.watch("country");

    if (selectedCountry === "vietnam") {
      return (dataAddressLv1?.data ?? []).map((item) => ({
        value: item.id,
        label: item.full_name,
      }));
    } else if (selectedCountry) {
      const country = countiesCitiesEnums.find(
        (item) => item.value === selectedCountry
      );
      return country?.cities ?? [];
    }
    return [];
  };

  // Regex for email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <form onSubmit={onSubmit}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={[12, 6]}>
          <CoreInput
            control={methodForm.control}
            name="name"
            label="Tên nhà cung cấp"
            placeholder="Nhập tên nhà cung cấp"
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <CoreInput
            control={methodForm.control}
            name="contactPhone"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <CoreInput
            control={methodForm.control}
            name="address"
            label="Địa chỉ chi tiết"
            placeholder="Nhập địa chỉ chi tiết"
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
            name="country"
            label="Quốc gia"
            required
            rules={{ required: "Trường này là bắt buộc!" }}
            placeholder="Chọn quốc gia"
          />
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <CoreAutoComplete
            loading={
              methodForm.watch("country") === "vietnam"
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
        {/* <GridItem colSpan={[12, 6]}>
          <CoreAutoComplete
            loading={isLoadingAddressLv2}
            options={(dataAddressLv2?.data ?? []).map((item) => ({
              value: item?.id,
              label: item.full_name,
            }))}
            control={methodForm.control}
            name="region"
            label="Quận/Huyện"
            placeholder="Chọn quận/huyện"
            isDisabled={!methodForm.watch("city")}
            required
            rules={{ required: "Trường này là bắt buộc!" }}
          />
        </GridItem> */}
        <GridItem colSpan={[6, 6]}>
          <CoreInput
            control={methodForm.control}
            name="contactEmail"
            label="Địa chỉ Email"
            placeholder="Nhập địa chỉ Email"
            required
            rules={{
              required: "Trường này là bắt buộc",
              pattern: {
                value: emailRegex,
                message:
                  "Email phải  hợp lệ (example@gmail.com)",
              },
            }}
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
            name="description"
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
              {isEdit ? "Cập nhật nhà cung cấp" : "Tạo mới nhà cung cấp"}
            </Button>
          </Box>
        </GridItem>
      </Grid>
    </form>
  );
};

export default SuppliersDetailAdmin;
