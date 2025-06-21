import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { deleteProduct, useQueryProductsList } from "../../../../services/customers/products";
import _ from "lodash";
import { Button, Tooltip } from "@mui/material";
import { BASE_URL } from "../../../../configs/auth";
import { Box } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const defaultValues = {
    pageNumber: 0,
    pageSize: 20,
    keyword: "",
};

const useListProduct = () => {
    const methodForm = useForm({ defaultValues });
    const keyword = methodForm.watch("keyword");

    const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const debounceFn = _.debounce((kw) => {
            setQueryPage((prev) => ({
                ...prev,
                keyword: kw,
                pageNumber: 0,
            }));
        }, 2000);

        debounceFn(keyword);

        return () => {
            debounceFn.cancel();
        };
    }, [keyword]);

    const onChangePageSize = (val) => {
        setQueryPage((prev) => ({
            ...prev,
            pageSize: val.pageSize,
            pageNumber: val.pageNumber,
        }));
    };

    const onChangePage = (val) => {
        setQueryPage((prev) => ({
            ...prev,
            pageNumber: val,
        }));
    };

    const onReset = () => {
        methodForm.reset(defaultValues);
        setQueryPage(_.omitBy(defaultValues, _.isNil));
    };

    const handleOpenDialog = (productId, name) => {
        setSelectedProductName(name);
        setSelectedProductId(productId)
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductName(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProduct({ id: selectedProductId });
            toast.success(`Xóa sản phẩm "${selectedProductName}" thành công!`);
            handleCloseDialog();
            refetch();
        } catch (err) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Xảy ra lỗi không xác định khi xóa sản phẩm.";
            toast.error(`Không thể xoá sản phẩm: ${errorMessage}`);
            console.error("Xoá sản phẩm thất bại:", err);
        }
    };
    const columns = useMemo(() => [
        { header: "Image", fieldName: "image", styleCell: { style: { minWidth: 250 } } },
        { header: <>Product <span style={{ color: "red" }}>*</span></>, fieldName: "productName" },
        { header: "Brand", fieldName: "brandName" },
        { header: <>Supplier <span style={{ color: "red" }}>*</span></>, fieldName: "supplierName" },
        { header: <>Items <span style={{ color: "red" }}>*</span></>, fieldName: "items" },
        { header: "Action", fieldName: "action" },
    ], []);

    const { data, isLoading, refetch } = useQueryProductsList({ ...queryPage });

    const dataTable = (data?.items ?? []).map((item) => ({
        id: item.id,
        image: (item?.images && item.images.length > 0)
            ? <img src={`${item.images[0]}`} alt="Product Image" style={{ width: 45, height: 40, objectFit: 'cover' }} />
            : "No Image",
        productName: item?.name || "",
        brandName: item?.brand?.name || "",
        supplierName: item?.supplier?.name || "",
        description: item?.description || "- không có mô tả -",
        items: (
            <Tooltip
                title={
                    <Box maxWidth={1000} minWidth={400}>
                        {item.variants?.length > 0 ? (
                            item.variants.map((variant) => (
                                <Box
                                    key={variant.id}
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    borderBottom="1px solid #eee"
                                    paddingY={1}
                                >
                                    <img
                                        src={`${variant?.images[0]}`}
                                        alt={variant?.name}
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                                    />
                                    <Box>
                                        <Box><strong>Name:</strong> {variant.name}</Box>
                                        <Box><strong>Color:</strong> {variant.color}</Box>
                                        <Box><strong>Size:</strong> {variant.size}</Box>
                                        <Box><strong>Price:</strong> {variant.price?.toLocaleString()} VND</Box>
                                        <Box><strong>Stock:</strong> {variant.stockQuantity}</Box>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Box color="gray">No Variants</Box>
                        )}
                    </Box>
                }
                arrow
                placement="top-start"
            >
                <span style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}>
                    {item.variants?.length || 0} variants
                </span>
            </Tooltip>
        ),
        action: <Button variant="outlined" color="error" onClick={() => handleOpenDialog(item.id, item.name)}>Xóa</Button>,
    }));

    return [{
        methodForm,
        columns,
        isLoading,
        openDialog,
        selectedProductName,
        dataTable,
        totalPages: data?.totalPages || 0,
        pageNumber: queryPage.pageNumber || 0,
        pageSize: queryPage.pageSize || 20,
    }, {
        navigate,
        handleCloseDialog,
        handleConfirmDelete,
        handleOpenDialog,
        onChangePage,
        onChangePageSize,
        onReset,
    }];
};

export default useListProduct
