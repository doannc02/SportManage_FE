import { Radio, useDisclosure, useToast } from "@chakra-ui/react";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  saveUser,
  useQueryCustomerCurrent,
} from "../../../services/admins/users";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

//  Default form values
export const defaultValues = {
  countryId: "",
  shippingAddresses: [],
};

const useCustomerProfile = () => {
  // ========================
  // Hook khởi tạo service
  // ========================
  const navigate = useNavigate();
  const toast = useToast();

  // ========================
  // Form & Field setup
  // ========================
  const methodForm = useForm({ defaultValues });
  const { control, handleSubmit, setValue, reset } = methodForm;

  const { fields: shippingAddressFields, append: appendShippingAddress } =
    useFieldArray({
      name: "shippingAddresses",
      control,
      keyName: "key",
    });

  // ========================
  //  State local
  // ========================
  const [defaultAddressId, setDefaultAddressId] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // ========================
  //  Modal dialog logic
  // ========================
  const handleOpenDialog = useCallback(() => setOpenDialog(true), []);
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

  const {
    isOpen: isOpenShippingModal,
    onOpen: onOpenShippingModal,
    onClose: onCloseShippingModal,
  } = useDisclosure();

  // ========================
  //  Lấy dữ liệu khách hàng
  // ========================
  const { data: detailData, refetch: refetchDetail } = useQueryCustomerCurrent({
    enabled: shouldFetch, // chỉ fetch sau lần đầu
  });
  console.log(detailData);

  useEffect(() => {
    startTransition(() => {
      setShouldFetch(true);
    });
  }, []);

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

  // ========================
  //  Submit form
  // ========================
  const { mutate, isLoading: isLoadingSubmit } = useMutation(saveUser, {
    onError: (err) =>
      toast({
        title: "Lỗi",
        description: err.message,
        status: "error",
      }),
    onSuccess: () => {
      refetchDetail();
      toast({
        title: "Thành công",
        description: "Thông tin của bạn đã được cập nhật!",
        status: "success",
      });
    },
  });

  const onSubmit = handleSubmit((input) => {
    const updatedShippingAddresses =
      input.shippingAddresses?.map((addr) => ({
        ...addr,
        isDefault: addr.id === defaultAddressId,
      })) || [];

    if (input.password) {
      if (!input.ConfirmPassWord || input.ConfirmPassWord.trim() === "") {
        toast({
          title: "Có lỗi xảy ra",
          description: "Vui lòng xác nhận mật khẩu trước khi gửi form",
          status: "error",
        });
        return;
      }
      if (input.password.trim() !== input.ConfirmPassWord.trim()) {
        toast({
          title: "Có lỗi xảy ra",
          description: "Mật khẩu xác nhận không trùng khớp",
          status: "error",
        });
        return;
      }
    }

    const formData = {
      ...input,
      shippingAddresses: updatedShippingAddresses,
    };

    mutate({ input: formData, method: "put" });
    handleCloseDialog();
  });

  // ========================
  //  Xử lý set địa chỉ mặc định
  // ========================
  const setAddressAsDefault = useCallback(
    (addressId) => {
      setDefaultAddressId(addressId);

      const updatedAddresses = shippingAddressFields.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      setValue("shippingAddresses", updatedAddresses);
    },
    [shippingAddressFields, setValue]
  );

  // ========================
  //  Cột bảng địa chỉ
  // ========================
  const columnShippingAddresses = useMemo(
    () => [
      { header: "Tên người nhận", fieldName: "recipientName" },
      { header: "Số điện thoại", fieldName: "phone" },
      { header: "Địa chỉ", fieldName: "fullAddress" },
      { header: "Mặc định", fieldName: "isDefaultRadio" },
    ],
    []
  );

  // ========================
  //  Dữ liệu bảng địa chỉ
  // ========================
  const dataTableShippingAddresses = useMemo(() => {
    return shippingAddressFields.map((item, index) => {
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
    });
  }, [shippingAddressFields, setAddressAsDefault]);

  // ========================
  //  Return API
  // ========================

  return [
    {
      dataTableShippingAddresses,
      isLoadingSubmit,
      isOpenShippingModal,
      columnShippingAddresses,
      shippingAddressFields,
      control,
      methodForm,
      detailData,
      openDialog,
    },
    {
      navigate,
      onOpenShippingModal,
      onCloseShippingModal,
      appendShippingAddress,
      onSubmit,
      setValue,
      setDefaultAddressId,
      refetchDetail,
      handleOpenDialog,
      handleCloseDialog,
    },
  ];
};

export default useCustomerProfile;
