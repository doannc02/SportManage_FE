import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { useToast } from "@chakra-ui/react";
import OrderStatusBadge from "./order-state-badge";
import { useUserOrderList } from "../../services/customers/orders";
import {
  putOrderState,
  useQueryOrdersPagingAdmin,
} from "../../services/admins/orders";
import { useMutation } from "react-query";

const defaultValues = {
  pageNumber: 0,
  pageSize: 20,
  keyWord: "",
  state: "",
};

const useListOrders = ({ role = "user" }) => {
  const methodForm = useForm({ defaultValues });
  const keyword = methodForm.watch("keyWord");
  const state = methodForm.watch("state");
  const toast = useToast();

  const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));

  // Dialog state cho việc thay đổi trạng thái
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const navigate = useNavigate();

  // Mutation cho việc update status (chỉ dành cho admin)
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: (data) => putOrderState(data),
    onError: (error) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      refetchQueryAdmin();
      toast({
        title: `Cập nhật sang trạng thái ${newStatus} thành công`,
        description: "Trạng thái đơn hàng đã được cập nhật",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

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

  // Xử lý thay đổi trạng thái
  //   const handleStatusChange = (orderId, currentStatus, newStatusValue) => {
  //     const data = role === "admin" ? dataAdmin : dataUser;
  //     const order = data?.items?.find((item) => item.id === orderId);
  //     if (order) {
  //       setSelectedOrder(order);
  //       setNewStatus(newStatusValue);
  //       setIsDialogOpen(true);
  //     }
  //   };

  const handleStatusChange = (orderId, currentStatus, newStatusValue) => {
    const data = role === "admin" ? dataAdmin : dataUser;
    const order = data?.items?.find((item) => item.id === orderId);

    if (order) {
      // Kiểm tra quyền chuyển trạng thái
      const isShipper = role === "shipper";
      const allowedShipperStatuses = ["Delivered", "Returned", "Canceled"];

      if (isShipper && !allowedShipperStatuses.includes(newStatusValue)) {
        toast({
          title: "Không có quyền",
          description:
            "Shipper chỉ được cập nhật thành Đã giao, Hoàn hàng hoặc Hủy",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedOrder(order);
      setNewStatus(newStatusValue);
      setIsDialogOpen(true);
    }
  };

  const onConfirmStatusChange = async () => {
    await updateStatusMutation({
      orderId: selectedOrder.id,
      newStatus: newStatus,
    });
    setIsDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const onCancelStatusChange = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const columns = useMemo(() => {
    const baseColumns = [
      { header: "Mã đơn hàng", fieldName: "id" },
      { header: "Tên khách hàng", fieldName: "customerName" },
      { header: "Tổng tiền", fieldName: "totalAmount" },
      { header: "Giảm giá", fieldName: "discountAmount" },
      { header: "Ngày đặt hàng", fieldName: "orderDate" },
      { header: "Tên người nhận", fieldName: "receiveName" },
      { header: "Số lượng mặt hàng", fieldName: "countItems" },
    ];

    // Cột trạng thái khác nhau cho user và admin
    // if (role === "admin") {
    //   baseColumns.push({
    //     header: "Trạng thái đơn hàng",
    //     fieldName: "state",
    //     // Nếu CoreTable hỗ trợ custom render
    //     customRender: (value, row) => (
    //       <OrderStatusBadge
    //         status={value}
    //         size="sm"
    //         isEditable={true}
    //         onStatusChange={(newStatus) =>
    //           handleStatusChange(row.id, value, newStatus)
    //         }
    //       />
    //     ),
    //   });
    // } else {
    //   baseColumns.push({
    //     header: "Trạng thái đơn hàng",
    //     fieldName: "state",
    //   });
    // }

    baseColumns.push({
      header: "Trạng thái đơn hàng",
      fieldName: "state",
      customRender: (value, row) => (
        <OrderStatusBadge
          status={value}
          size="sm"
          isEditable={role === "admin" || role === "shipper"}
          onStatusChange={(newStatus) =>
            handleStatusChange(row.id, value, newStatus)
          }
          isAdmin={role === "admin"}
        />
      ),
    });

    return baseColumns;
  }, [role]);

  const { data: dataUser, isLoading: isLoadingQueryUser } = useUserOrderList(
    { ...queryPage },
    { enabled: role === "user" }
  );
  const {
    data: dataAdmin,
    isLoading: isLoadingQueryAdmin,
    refetch: refetchQueryAdmin,
  } = useQueryOrdersPagingAdmin(
    { ...queryPage },
    { enabled: role === "admin" }
  );

  const data = role === "admin" ? dataAdmin : dataUser;
  console.log(data, "response");
  const dataTable = useMemo(() => {
    return (data?.items ?? []).map((item) => ({
      id: item.id,
      customerName: item.customerName || "",
      description: item?.notes || "- không có ghi chú -",
      discountAmount: item?.discountAmount ?? "-",
      orderDate: item.orderDate
        ? new Date(item.orderDate).toLocaleString()
        : "-",
      receiveName: item?.shippingAddress?.receiveName ?? "-",
      countItems: item.orderItems?.length || 0,
      state:
        role === "admin" ? (
          <OrderStatusBadge
            status={item.state}
            size="sm"
            isEditable={true}
            onStatusChange={(newStatus) =>
              handleStatusChange(item.id, item.state, newStatus)
            }
          />
        ) : (
          <OrderStatusBadge status={item.state} size="sm" />
        ),
    }));
  }, [data, role, handleStatusChange]);

  return [
    {
      methodForm,
      columns,
      isLoading: isLoadingQueryUser || isLoadingQueryAdmin,
      dataTable,
      totalPages: data?.totalPages || 0,
      pageNumber: queryPage.pageNumber || 0,
      pageSize: queryPage.pageSize || 20,
      // Dialog state
      isDialogOpen,
      selectedOrder,
      newStatus,
    },
    {
      navigate,
      onChangePage,
      onChangePageSize,
      onReset,
      setQueryPage,
      // Dialog actions
      onStatusChange: handleStatusChange,
      onConfirmStatusChange,
      onCancelStatusChange,
    },
  ];
};

export default useListOrders;
