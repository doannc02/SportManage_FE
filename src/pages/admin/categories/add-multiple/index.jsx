import { Grid, GridItem, Button, useToast, Box } from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";
import CoreTable from "../../../../components/atoms/CoreTable";
import { useMemo } from "react";
import CoreInput from "../../../../components/atoms/CoreInput";
import { MultiImageUploader } from "../../../../components/atoms/ImageUploader";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { postCategory } from "../../../../services/admins/categories";

const AddMultipleCategories = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const { control, getValues, setValue, handleSubmit } = useForm({
        defaultValues: {
            categories: [
                {
                    name: "",
                    description: "",
                    logo: "",
                },
            ],
        },
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: postCategory,
        onSuccess: () => {
            toast({
                title: "Thành công",
                description: "Thêm danh mục thành công",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/categories/list");
        },
        onError: (error) => {
            toast({
                title: "Lỗi",
                description:
                    error.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "categories",
    });

    const columns = useMemo(
        () => [
            { header: "Tên danh mục", fieldName: "name" },
            { header: "Mô tả", fieldName: "description" },
            { header: "Logo", fieldName: "logo" },
            { header: "Action", fieldName: "action" },
        ],
        []
    );

    const dataTable = fields.map((item, index) => ({
        ...item,
        name: (
            <CoreInput
                required
                rules={{ required: "Trường này là bắt buộc" }}
                control={control}
                name={`categories.${index}.name`}
                placeholder="Nhập tên danh mục"
            />
        ),
        description: (
            <CoreInput
                required
                rules={{ required: "Trường này là bắt buộc" }}
                control={control}
                name={`categories.${index}.description`}
                placeholder="Nhập mô tả cho danh mục"
            />
        ),
        logo: (
            <MultiImageUploader
                required
                rules={{ required: "Trường này là bắt buộc" }}
                height={"45px"}
              //  defaultValue={getValues(`categories.${index}.logo`)}
                onChange={(urls) => setValue(`categories.${index}.logo`, urls[0])}
                maxFiles={1}
            />
        ),
        action: (
            <Button
                type="button"
                onClick={() => remove(index)}
                colorScheme="red"
                size="sm"
            >
                Xoá
            </Button>
        ),
    }));

    const onSubmit = (data) => {
        // Filter out empty categories
        const nonEmptyCategories = data.categories.filter(
            (cat) =>
                cat.name.trim() !== "" ||
                cat.description.trim() !== "" ||
                cat.logo !== ""
        );

        if (nonEmptyCategories.length === 0) {
            toast({
                title: "Cảnh báo",
                description: "Vui lòng nhập ít nhất một danh mục",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        mutate({ categories: nonEmptyCategories });
    };

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
            <GridItem colSpan={12}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="flex" justifyContent="end" mb={2}>
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                append({
                                    name: "",
                                    description: "",
                                    logo: ""
                                });
                            }}
                        >
                            + Thêm danh mục
                        </Button>
                    </Box>
                    <GridItem colSpan={12} mt={4}>
                        <CoreTable
                            columns={columns}
                            paginationHidden
                            data={dataTable}
                            isLoading={isLoading}
                        />
                    </GridItem>

                    <GridItem
                        colSpan={12}
                        mt={4}
                        display="flex"
                        justifyContent="center"
                        gap={4}
                    >
                        <Button
                            type="button"
                            onClick={() => navigate("/categories/list")}
                            colorScheme="gray"
                        >
                            Quay lại
                        </Button>
                        <Button type="submit" colorScheme="green" isLoading={isLoading}>
                            Thêm mới danh sách danh mục
                        </Button>
                    </GridItem>
                </form>
            </GridItem>
        </Grid>
    );
};

export default AddMultipleCategories;
