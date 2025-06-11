import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useUserOrderList } from "../../../../services/customers/orders";
import OrderStatusBadge from "../../../../components/orders/order-state-badge";

const defaultValues = {
    pageNumber: 0,
    pageSize: 20,
    keyWord: "",
    state: ''
};

const useListOrderUser = () => {
    const methodForm = useForm({ defaultValues });
    const keyword = methodForm.watch("keyWord");

    const state = methodForm.watch("state");

    const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));

    const navigate = useNavigate()

    useEffect(() => {
        const debounceFn = _.debounce((kw) => {
            setQueryPage((prev) => ({
                ...prev,
                keyWord: kw,
                pageNumber: 0,
            }));
        }, 2000);

        debounceFn(keyword);

        return () => {
            debounceFn.cancel();
        };
    }, [keyword]);

    useEffect(() => {
        setQueryPage((prev) => ({
            ...prev,
            state: state,
            pageNumber: 0,
        }));
    }, [state]);

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


    const columns = useMemo(() => [
        { header: "Mã đơn hàng", fieldName: "id" },
        { header: "Tên khách hàng", fieldName: "customerName" },
        { header: "Giảm giá", fieldName: "discountAmount" },
        { header: "Ngày đặt hàng", fieldName: "orderDate" },

        { header: "Tên người nhận", fieldName: "receiveName" },
        { header: "Số lượng mặt hàng", fieldName: "countItems" },
        { header: "Trạng thái đơn hàng", fieldName: "state" },
    ], []);


    const { data, isLoading } = useUserOrderList({ ...queryPage })

    const dataTable = (data?.items ?? []).map((item) => ({
        id: item.id,
        customerName: item.customerName || "",
        description: item.notes || "- không có ghi chú -",
        discountAmount: item.discountAmount ?? "-",
        orderDate: item.orderDate ? new Date(item.orderDate).toLocaleString() : "-",
        receiveName: item?.shippingAddress?.receiveName ?? "-",
        countItems: item.orderItems?.length || 0,
        state: item.state ? <OrderStatusBadge status={item.state} size="sm" /> : "-",
    }));


    return [{
        methodForm,
        columns,
        isLoading,
        dataTable,
        totalPages: data?.totalPages || 0,
        pageNumber: queryPage.pageNumber || 0,
        pageSize: queryPage.pageSize || 20,
    }, {
        navigate,
        onChangePage,
        onChangePageSize,
        onReset,
        setQueryPage
    }];
};

export default useListOrderUser
