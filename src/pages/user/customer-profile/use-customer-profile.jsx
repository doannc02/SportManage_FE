import { Radio, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  saveUser,
  useQueryCustomerCurrent,
} from "../../../services/admins/users";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

export const defaultValues = {
  countryId: "",
  shippingAddresses: [],
};
const useCustomerProfile = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const methodForm = useForm({ defaultValues: defaultValues });
  const { control, handleSubmit, setValue, reset } = methodForm;

  // State to track the default address ID
  const [defaultAddressId, setDefaultAddressId] = useState("");
  const { data: detailData, refetch } = useQueryCustomerCurrent();

  const { mutate, isLoading: isLoadingSubmit } = useMutation(saveUser, {
    onError: (err) =>
      toast({ title: "Lỗi", description: err.message, status: "error" }),
    onSuccess: () => {
      refetch();
      toast({
        title: "Thành công",
        description: "Chỉnh sửa thành công!",
        status: "success",
      });
    },
  });

  const {
    isOpen: isOpenShippingModal,
    onOpen: onOpenShippingModal,
    onClose: onCloseShippingModal,
  } = useDisclosure();

  const { fields: shippingAddressFields, append: appendShippingAddress } =
    useFieldArray({
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
    ],
    []
  );

// Main form submission
const onSubmit = handleSubmit((input) => {
    const updatedShippingAddresses =
        input.shippingAddresses?.map((addr) => ({
            ...addr,
            isDefault: addr.id === defaultAddressId,
        })) || [];

    // Kiểm tra ConfirmPassWord trong input thay vì methodForm.getValues
    if (!input.ConfirmPassWord || input.ConfirmPassWord.trim() === "") {
        toast({
            title: "Có lỗi xảy ra",
            description: "Vui lòng xác nhận mật khẩu trước khi gửi form",
            status: "error",
        });
        return; // Prevent form submission if ConfirmPassWord is empty
    }

    const formData = {
        ...input,
        shippingAddresses: updatedShippingAddresses,
    };

    mutate({ input: formData, method: "put" });
});


  const setAddressAsDefault = (addressId) => {
    setDefaultAddressId(addressId);

    const updatedAddresses = shippingAddressFields.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
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
            key={index}
            isChecked={item.isDefault}
            onChange={() => setAddressAsDefault(item.id)}
            colorScheme="green"
          />
        ),
      };
    }
  );
  useEffect(() => {
    if (detailData) {
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
  }, [detailData, reset]);

  return [
    {
      dataTableShippingAddresses,
      isLoadingSubmit,
      isOpenShippingModal,
      columnShippingAddresses,
      shippingAddressFields,
      control,
    },
    {
      navigate,
      onOpenShippingModal,
      onCloseShippingModal,
      appendShippingAddress,
      onSubmit,
      setValue,
      setDefaultAddressId,
    },
  ];
};

export default useCustomerProfile;
