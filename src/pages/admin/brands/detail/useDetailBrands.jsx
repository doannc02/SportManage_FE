// File: useDetailVoucher.ts
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  getDetailBrand,
  postBrand,
  putBrand,
} from "../../../../services/admins/brands";

export const useDetailBrands = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const methodForm = useForm({
    defaultValues: {
      name: "",
      slug: "",
      logoUrl: "",
      website: "",
      country: "",
      countryId: "vietnam",
      city: "",
      descriptions: null,
      isActive: true,
      foundedYear: "",
    },
  });

  console.log(methodForm.getValues(), "methodForm");

  const { refetch } = useQuery({
    enabled: isEdit,
    queryKey: ["brand-detail", id],
    queryFn: () => getDetailBrand({ id }),
    onSuccess: (data) => {
      methodForm.reset({
        ...data,
        foundedYear: !isEdit
          ? dayjs(Date.now()).format("YYYY").toString()
          : data.foundedYear,
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? putBrand(values) : postBrand(values)),
    onSuccess: () => {
      toast({
        title: isEdit ? "Cập nhật thành công" : "Tạo mới thành công",
        status: "success",
        position: "top",
      });
      refetch();
      navigate(`/brands/list`);
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
