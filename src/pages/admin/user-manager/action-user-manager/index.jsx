import {
  Box,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  useToast,
  Radio,
  Text,
} from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import CoreTable from "../../../../components/atoms/CoreTable";
import CoreAutoComplete from "../../../../components/atoms/CoreAutoComplete";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import {
  saveUser,
  useQueryUserDetail,
} from "../../../../services/admins/users";
import { getAppToken } from "../../../../configs/token";
import ShippingAddressModal from "../../../../components/shared/dialog/dialog-add-shipping-address";

export const defaultValues = {
  countryId: "",
  shippingAddresses: [],
};

const UserDetailAdmin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id, actionType } = useParams();

  const tokenApp = getAppToken();

  const isAdmin = tokenApp?.roles?.includes("Admin");

  const methodForm = useForm({ defaultValues: defaultValues });
  const { control, handleSubmit, setValue, reset } = methodForm;

  // State to track the default address ID
  const [defaultAddressId, setDefaultAddressId] = useState("");

  // Shipping address modal
  const {
    isOpen: isOpenShippingModal,
    onOpen: onOpenShippingModal,
    onClose: onCloseShippingModal,
  } = useDisclosure();

  const { data: detailData, refetch } = useQueryUserDetail(
    { id },
    { enabled: !!id }
  );

  const { mutate, isLoading: isLoadingSubmit } = useMutation(saveUser, {
    onError: (err) =>
      toast({ title: "Lỗi", description: err.message, status: "error" }),
    onSuccess: (res) => {
      navigate(`/users/detail/${res.id}`);
      refetch();
      toast({
        title: "Thành công",
        description: !id ? "Thêm mới thành công!" : "Chỉnh sửa thành công!",
        status: "success",
      });
    },
  });

  // Form arrays for shipping addresses
  const {
    fields: shippingAddressFields,
    append: appendShippingAddress,
    remove: removeShippingAddress,
  } = useFieldArray({
    name: "shippingAddresses",
    control,
    keyName: "key",
  });

  // Column config for shipping addresses table
  const columnShippingAddresses = useMemo(
    () => [
      {
        header: "Tên người nhận",
        fieldName: "recipientName",
      },
      {
        header: "Số điện thoại",
        fieldName: "phone",
      },
      {
        header: "Địa chỉ",
        fieldName: "fullAddress",
      },
      {
        header: "Mặc định",
        fieldName: "isDefaultRadio",
      },
      ...(!id
        ? [
            {
              header: "Thao tác",
              fieldName: "action",
            },
          ]
        : []),
    ],
    [id]
  );

  // Handle setting a shipping address as default
  const setAddressAsDefault = (addressId) => {
    // Update the defaultAddressId state
    setDefaultAddressId(addressId);

    // Update the isDefault property for all addresses
    const updatedAddresses = shippingAddressFields.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    // Update the form values
    setValue("shippingAddresses", updatedAddresses);
  };

  // Prepare data for shipping addresses table
  const dataTableShippingAddresses = shippingAddressFields.map(
    (item, index) => {
      const fullAddress = [
        item.addressLine,
        item.ward,
        item.district,
        item.city,
        item.country,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        ...item,
        fullAddress,
        isDefaultRadio: (
          <Radio
            isChecked={item.isDefault}
            onChange={() => setAddressAsDefault(item.id)}
            colorScheme="green"
          />
        ),
        action: (
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => removeShippingAddress(index)}
          >
            Xoá
          </Button>
        ),
      };
    }
  );

  // Main form submission
  const onSubmit = handleSubmit((input) => {
    // Ensure we correctly mark the default address in the final data
    const updatedShippingAddresses =
      input.shippingAddresses?.map((addr) => ({
        ...addr,
        isDefault: addr.id === defaultAddressId,
      })) || [];

    // Process and submit the complete form data
    const formData = {
      ...input,
      shippingAddresses: updatedShippingAddresses,
    };

    mutate({ input: formData, method: id ? "put" : "post" });
  });

  // Load user data when available
  useEffect(() => {
    if (detailData && id) {
      // Find default address if present
      const defaultAddress = detailData?.shippingAddresses?.find(
        (addr) => addr.isDefault
      );
      if (defaultAddress) {
        setDefaultAddressId(defaultAddress.id);
      }

      reset({
        ...detailData,
        userName: detailData?.user?.username || "",
        email: detailData?.user?.email || "",
        shippingAddresses: detailData?.shippingAddresses || [],
      });
    }
  }, [detailData, id, reset]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
          {actionType === "modifiedAddresses" ? null : (
            <>
              {" "}
              <GridItem colSpan={[6, 6, 4]}>
                <CoreInput
                  readOnly
                  control={control}
                  name="userName"
                  label="Tên người dùng"
                  placeholder="Nhập tên người dùng"
                  disabled={id ? true : false}
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
                  disabled={id ? true : false}
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
                  disabled={id ? true : false}
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
                  disabled={id ? true : false}
                  rules={{ required: "Trường này là bắt buộc!" }}
                  name="gender"
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                />
              </GridItem>
              <GridItem colSpan={[6, 6, 4]}>
                <CoreInput
                  control={control}
                  name="age"
                  label="Tuổi"
                  placeholder="Nhập tuổi"
                  type="number"
                  disabled={id ? true : false}
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
              {!isAdmin && (
                <GridItem colSpan={[6, 6, 4]}>
                  <CoreInput
                    control={control}
                    name="password"
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    disabled={id ? true : false}
                    type="password"
                    rules={{
                      required: !id ? "Trường này là bắt buộc!" : false,
                    }}
                  />
                </GridItem>
              )}
              <GridItem colSpan={12}>
                <CoreInput
                  control={control}
                  name="address"
                  label="Địa chỉ nhà"
                  placeholder="Nhập địa chỉ nhà"
                  required
                  disabled={id ? true : false}
                  rules={{ required: "Trường này là bắt buộc!" }}
                />
              </GridItem>
            </>
          )}

          {/* Shipping addresses section */}
          <GridItem colSpan={12} mt={6}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Text fontSize="xl" fontWeight="bold">
                Địa chỉ giao hàng
              </Text>
              {!id && (
                <Button colorScheme="blue" onClick={onOpenShippingModal}>
                  + Thêm địa chỉ giao hàng
                </Button>
              )}
            </Box>

            {shippingAddressFields.length > 0 ? (
              <CoreTable
                columns={columnShippingAddresses}
                data={dataTableShippingAddresses}
                paginationHidden
              />
            ) : (
              <Box p={4} textAlign="center" borderWidth={1} borderRadius="md">
                <Text color="gray.500">Chưa có địa chỉ giao hàng nào</Text>
              </Box>
            )}
          </GridItem>

          {/* Submit button */}
          {!id && (
            <GridItem colSpan={12} mt={6}>
              <Box display="flex" justifyContent="center">
                <Button
                  isLoading={isLoadingSubmit}
                  colorScheme="teal"
                  size="lg"
                  type="submit"
                >
                  Tạo người dùng mới
                </Button>
              </Box>
            </GridItem>
          )}
        </Grid>
      </form>

      {/* Modal for adding shipping address */}
      <ShippingAddressModal
        isOpen={isOpenShippingModal}
        onClose={onCloseShippingModal}
        onSubmit={(data) => {
          const newAddressId = crypto.randomUUID();

          // If this is set as default, update other addresses to not be default
          if (data.isDefault) {
            // Update existing addresses
            const updatedAddresses = shippingAddressFields.map((addr) => ({
              ...addr,
              isDefault: false,
            }));

            // Reset the field array with updated addresses
            setValue("shippingAddresses", updatedAddresses);

            // Update the default address ID
            setDefaultAddressId(newAddressId);
          }
          // Add the new shipping address with names
          appendShippingAddress(data);
        }}
      />
    </>
  );
};

export default UserDetailAdmin;
