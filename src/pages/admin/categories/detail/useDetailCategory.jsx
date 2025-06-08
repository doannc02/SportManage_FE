// File: useDetailCategoryAdmin.ts
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { getDetailCategory, putCategory } from "../../../../services/admins/categories"

export const useDetailCategoryAdmin = () => {
    const { id } = useParams()
    const toast = useToast()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const methodForm = useForm({
        defaultValues: {
            code: "",
            name: "",
        }
    })

    const { isLoading, refetch } = useQuery({
        enabled: isEdit,
        queryKey: ["category-detail", id],
        queryFn: () => getDetailCategory({ id }),
        onSuccess: (data) => {
            methodForm.reset({
                ...data,
            })
        }
    })

    const mutation = useMutation({
        mutationFn: (values) => putCategory(values),
        onSuccess: (data) => {
            toast({
                title: "Cập nhật thành công",
                status: "success",
                position: "top"
            })
            refetch()
            if (!isEdit) {
                navigate(`/categories/detail/${data}`)
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
            isLoadingQuery: isLoading,
            isLoadingSubmit: mutation.isLoading
        },
        {
            onSubmit
        }
    ]
}
