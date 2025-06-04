// File: useDetailVoucher.ts
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { getDetailVoucher, postVoucher, putVoucher } from "../../../../services/admins/vouchers"

export const useDetailVoucher = () => {
    const { id } = useParams()
    const toast = useToast()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const methodForm = useForm({
        defaultValues: {
            code: "",
            name: "",
            startDate: null,
            endDate: null,
            discountPercent: 0,
            discountAmount: 0,
            minOrderAmount: 0,
            quantity: 1
        }
    })

    const { isLoading, refetch } = useQuery({
        enabled: isEdit,
        queryKey: ["voucher-detail", id],
        queryFn: () => getDetailVoucher({ id }),
        onSuccess: (data) => {
            methodForm.reset({
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            })
        }
    })

    const mutation = useMutation({
        mutationFn: (values) => isEdit ? putVoucher(values) : postVoucher(values),
        onSuccess: (data) => {
            toast({
                title: isEdit ? "Cập nhật thành công" : "Tạo mới thành công",
                status: "success",
                position: "top"
            })
            refetch()
            if (!isEdit) {
                navigate(`/vouchers/detail/${data}`)
            }
        },
        onError: () => {
            toast({
                title: "Có lỗi xảy ra",
                status: "error",
                position: "top"
            })
        }
    })

    const onSubmit = methodForm.handleSubmit((values) => {
        mutation.mutate(values)
    })

    return [
        {
            id,
            isEdit,
            methodForm,
            isLoadingSubmit: mutation.isLoading
        },
        {
            onSubmit
        }
    ]
}
