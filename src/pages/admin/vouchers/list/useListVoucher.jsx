import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { deleteProduct } from "../../../../services/customers/products";
import _ from "lodash";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryVouchers } from "../../../../services/admins/vouchers";
import { discountTypeEnums } from "../../../../const/enum";

const defaultValues = {
    pageNumber: 0,
    pageSize: 20,
    keyWord: "",
    startDate: "",
    endDate: ""
};

const useListVouchers = () => {
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
                // pageNumber: 0,
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
            pageNumber: val.pageNumber - 1,
        }));
    };

    const onChangePage = (event,val) => {
        setQueryPage((prev) => ({
            ...prev,
            pageNumber: val - 1,
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
        { header: "Mã voucher", fieldName: "code" },
        { header: "Tên chương trình", fieldName: "name" },
        { header: "Loại giảm giá", fieldName: "discountType" },
        { header: "Giá trị giảm", fieldName: "discountValue" },
        { header: "Giá trị đơn tối thiểu", fieldName: "minOrderValue" },
        { header: "Ngày bắt đầu", fieldName: "startDate" },
        { header: "Ngày kết thúc", fieldName: "endDate" },
        { header: "Trạng thái", fieldName: "isActive" },
        { header: "Số lần còn lại", fieldName: "remainingUsage" },
        { header: "Số lần còn lại / người", fieldName: "remainingUserUsage" },
        { header: "Ngày tạo", fieldName: "createdAt" },
        { header: "Hành động", fieldName: "action" },
    ], []);



    const { data, isLoading, refetch } = useQueryVouchers({
        ...queryPage,
    }, {
        enabled: !!queryPage,
    });

    const dataTable = (data?.items ?? []).map((item) => ({
        id: item.id,
        code: item.code || "",
        name: item.name || "",
        description: item.description || "- không có mô tả -",
        discountType: discountTypeEnums.find(i => i.value === item.discountTypeDisplay)?.label || item.discountTypeDisplay,
        discountValue: item.discountValue ?? "-",
        minOrderValue: item.minOrderValue ?? "-",
        startDate: item.startDate ? new Date(item.startDate).toLocaleString() : "-",
        endDate: item.endDate ? new Date(item.endDate).toLocaleString() : "-",
        isActive: item.isActive ? "Đang hoạt động" : "Không hoạt động",
        remainingUsage: item.remainingUsage ?? "-",
        remainingUserUsage: item.remainingUserUsage ?? "-",
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
        action: (
            <Button
                variant="outlined"
                color="error"
                onClick={() => handleOpenDialog(item.id, item.name)}
            >
                Xóa
            </Button>
        ),
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

export default useListVouchers
