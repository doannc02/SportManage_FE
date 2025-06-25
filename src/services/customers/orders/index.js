import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const createOrderUser = async ({
  notes,
  shippingAddressId,
  paymentMethod,
  items,
  voucherCode,
}) => {
  const { data } = await authApi({
    method: "post",
    url: "/api/orders",
    data: {
      notes,
      shippingAddressId,
      paymentMethod,
      items,
      voucherCode,
    },
  });
  return data;
};

export const createCancelRequest = async ({
  orderId,
  reason,
  date,
  detailReason,
}) => {
  const { data } = await authApi({
    method: "put",
    url: "/api/orders/cancel",
    data: {
      orderId,
      reason,
      date,
      detailReason,
    },
  });
  return data;
};

export const getOrderList = async (params) => {
  const { data } = await authApi({
    method: "get",
    url: "/api/orders/user-paging",
    params: params,
  });
  return data;
};

export const useUserOrderList = (params, options) => {
  return useQuery(["/orders/user-paging", params], () => getOrderList(params), {
    ...options,
  });
};

export const getOrderDetail = async ({ id }) => {
  const { data } = await authApi({
    method: "get",
    url: `/api/orders/${id}`,
    params: {
      id: id,
    },
  });
  return data;
};

export const useQueryOrderDetail = ({ id }, options) => {
  return useQuery(
    ["/api/orders/detail", id],
    () =>
      getOrderDetail({
        id,
      }),
    {
      ...defaultOption,
      ...options,
    }
  );
};
