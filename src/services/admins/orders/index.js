import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const getOrdersPagingAdmin = async ({
    pageNumber = 1,
    pageSize = 20,
    keyword = '',
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
            keyword,
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

export const useQueryOrdersPagingAdmin = ({
    pageNumber,
    pageSize,
    keyword = '',
    startDate = '',
    endDate = '',
    state = '',
    customerId = '',
    fromDate = '',
    toDate = ''
},
    options
) => {
    return useQuery(
        ['/api/orders/admin-paging', pageNumber, pageSize, keyword, startDate, endDate, state, customerId, fromDate, toDate],
        () => getOrdersPagingAdmin({
            pageNumber,
            pageSize,
            keyword,
            startDate,
            endDate,
            state,
            customerId,
            fromDate,
            toDate
        }),
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
        id,
        state
    }
) => {
    const { data } = await authApi({
        method: 'put',
        url: `/api/orders/${id}/state`,
        data: {
            state
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
