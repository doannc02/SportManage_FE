import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"

export const createOrderUser = async (
    {
        notes,
        shippingAddressId,
        paymentMethod,
        items,
        voucherCode
    }
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/api/orders',
        data: {
            notes,
            shippingAddressId,
            paymentMethod,
            items,
            voucherCode
        }
    })
    return data
}



export const getOrderList = async (

) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/orders/user-paging',
    })
    return data
}

export const useUserOrderList = (
    options
) => {
    return useQuery(['/orders/user-paging'], () => getOrderList(), {
        ...options,
    })
}


export const getOrderDetail = async (
    {
        id
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/orders/${id}`,
        params: {
            id: id
        }
    })
    return data
}

export const useQueryOrderDetail = (
    {
        id
    },
    options
) => {
    return useQuery(['/api/orders/detail', id], () => getOrderDetail({
        id
    }), {
        // ...defaultOption,
        ...options,
    })
}