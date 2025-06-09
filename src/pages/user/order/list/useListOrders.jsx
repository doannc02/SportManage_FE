import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { deleteProduct } from "../../../../services/customers/products";
import _ from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserOrderList } from "../../../../services/customers/orders";
import { Button } from "antd";

const defaultValues = {
    pageNumber: 0,
    pageSize: 20,
    keyWord: "",
};

const useListOrders = () => {
    const methodForm = useForm({ defaultValues });
    const keyword = methodForm.watch("keyword");

    const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderName, setSelectedOrderName] = useState(null);
    const [selectedProductId, setSelectedOrderId] = useState(null);

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

    const handleOpenDialog = (productId) => {
        setSelectedOrderId(productId)
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrderName(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProduct({ id: selectedProductId });
            toast.success(`Xóa đơn hàng thành công!`);
            handleCloseDialog();
            refetch();
        } catch (err) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Xảy ra lỗi không xác định khi xóa đơn hàng.";
            toast.error(`Không thể xoá đơn hàng: ${errorMessage}`);
            console.error("Xoá đơn hàng thất bại:", err);
        }
    };
    const columns = useMemo(() => [
        { header: "Mã đơn hàng", fieldName: "id" },
        { header: "Tên khách hàng", fieldName: "customerName" },
        { header: "Giảm giá", fieldName: "discountAmount" },
        { header: "Ngày đặt hàng", fieldName: "orderDate" },

        { header: "Tên người nhận", fieldName: "receiveName" },
        { header: "Số lượng mặt hàng", fieldName: "countItems" },
        { header: "Trạng thái đơn hàng", fieldName: "state" },
    ], []);


    const {data, isLoading, refetch} = useUserOrderList({...queryPage,})
    console.log(data);
    
    // const { data, isLoading, refetch } = useQueryVouchers({
    //     ...queryPage,
    // }, {
    //     enabled: !!queryPage,
    // });
    
    const dataTable = (data?.items ?? []).map((item) => ({
        id: item.id,
        customerName: item.customerName || "",
        description: item.notes || "- không có ghi chú -",
        discountAmount: item.discountAmount ?? "-",
        orderDate: item.orderDate ? new Date(item.orderDate).toLocaleString() : "-",
        receiveName: item?.shippingAddress?.receiveName ?? "-",
        countItems: "0",
        state: item.state ?? "-",
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
        selectedOrderName,
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

export default useListOrders
