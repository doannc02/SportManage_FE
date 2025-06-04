import { authApi } from "../../../configs/auth"
import { useQuery } from "react-query"

export const getCartDetail = async (

) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/carts',
    })
    return data
}

export const useQueryCartDetail = (
    options
) => {
    return useQuery(['/api/carts'], () => getCartDetail(), {
        // ...defaultOption,
        ...options,
    })
}


export const updateQtyCartItem = async (
    { cartItemId,
        quantity }
) => {
    console.log(cartItemId, quantity, 'log')
    const { data } = await authApi({
        method: 'put',
        url: '/api/carts/update-quantity',
        data: {
            cartItemId,
            quantity
        },
    })
    return data
}

export const addToCartItem = async (
    { productVariantId,
        quantity }
) => {
    console.log(productVariantId, quantity, 'log')
    const { data } = await authApi({
        method: 'post',
        url: '/api/carts',
        data: {
            productVariantId,
            quantity
        },
    })
    return data
}

export const removeCartItem = async (
    { cartItemId }
) => {
    const { data } = await authApi({
        method: 'delete',
        url: `/api/carts/${cartItemId}`,
        data: {
            id: cartItemId
        },
    })
    return data
}