import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const getOrdersPagingAdmin = async ({
    pageNumber = 1,
    pageSize = 20,
    keyWord = '',
    startDate = '',
    endDate = '',
    state = '',
    customerId = '',
    fromDate = '',
    toDate = ''
}
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/orders/admin-paging',
        params: {
            pageNumber,
            pageSize,
            keyWord,
            startDate,
            endDate,
            state,
            customerId,
            fromDate,
            toDate
        }
    })
    return data
}

export const useQueryOrdersPagingAdmin = (params,
    options
) => {
    return useQuery(
        ['/api/orders/admin-paging', params],
        () => getOrdersPagingAdmin(params),
        {
            ...defaultOption,
            ...options,
        }
    );
}


export const getDetailOrder = async ({
    id
}
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/orders/${id}`,
        params: {
            id
        }
    })
    return data
}

export const useQueryDetailVoucher = ({
    id
},
    options
) => {
    return useQuery(
        ['/api/orders/detail', id],
        () => getDetailOrder({
            id
        }),
        {
            ...defaultOption,
            ...options,
        }
    );
}

export const putOrderState = async (
    {
        orderId,
        newStatus,
        reason,
        shipperId,
        imageConfirmed
    }
) => {
    const { data } = await authApi({
        method: 'put',
        url: `/api/orders/${orderId}/status`,
        params: orderId,
        data: {
            orderId,
            newStatus,
            reason,
            shipperId,
            imageConfirmed
        }
    })
    return data
}

export const putVoucher = async (
    input
) => {
    const { data } = await authApi({
        method: 'put',
        url: '/api/orders/update',
        data: input,
    })
    return data
}

export const deleteProduct = async (
    { id
    }
) => {
    const { data } = await authApi({
        method: 'delete',
        url: `/api/products/${id}`,
        data: id,
    })
    return data
}
