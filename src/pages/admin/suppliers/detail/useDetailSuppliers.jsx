// File: useDetailVoucher.ts
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getDetailSupplier, postSupplier, putSupplier } from "../../../../services/admins/suppliers";

export const useDetailSuppliers = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const methodForm = useForm({
    defaultValues: {
      name: "",
      contactPhone:"",
      address: "",
      region: "",
      postalCode: "",
      country: "vietnam",
      phone:"",
      city: "",
      fax:"",
      description: null,
      isActive: true,
      contactEmail: "",
    },
  });

  const {  refetch } = useQuery({
    enabled: isEdit,
    queryKey: ["supplier-detail", id],
    queryFn: () => getDetailSupplier({ id }),
    onSuccess: (data) => {
      methodForm.reset({
        ...data,
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? putSupplier(values) : postSupplier(values)),
    onSuccess: () => {
      toast({
        title: isEdit ? "Cập nhật thành công" : "Tạo mới thành công",
        status: "success",
        position: "top",
      });
      refetch();
      navigate(`/suppliers/list`);
    },
    onError: () => {
      toast({
        title: "Có lỗi xảy ra",
        status: "error",
        position: "top",
      });
    },
  });

  const onSubmit = methodForm.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return [
    {
      id,
      isEdit,
      methodForm,
      isLoadingSubmit: mutation.isLoading,
    },
    {
      onSubmit,
    },
  ];
};
