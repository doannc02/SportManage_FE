import { useQuery } from "react-query"
import { addressApi } from "../../configs/auth"

export const getAddressLv1 = async (

) => {

    const { data } = await addressApi({
        method: 'get',
        url: '/api-tinhthanh/1/0.htm',
    })
    return data
}

export const useQueryAddressLv1 = (
    options
) => {
    return useQuery(['/api-tinhthanh/1/0.htm'], () => getAddressLv1(), {
        // ...defaultOption,
        ...options,
    })
}


export const getAddressLv2 = async (
    { id }
) => {
    const { data } = await addressApi({
        method: 'get',
        url: `/api-tinhthanh/2/${id}.htm`,
    })
    return data
}

export const useQueryAddressLv2 = (
    { id },
    options
) => {
    return useQuery([`/api-tinhthanh/2/${id}.htm`], () => getAddressLv2({ id }), {
        // ...defaultOption,
        ...options,
    })
}


export const getAddressLv3 = async (
    { id }
) => {
    const { data } = await addressApi({
        method: 'get',
        url: `/api-tinhthanh/3/${id}.htm`,
    })
    return data
}

export const useQueryAddressLv3 = (
    { id },
    options
) => {
    return useQuery([`/api-tinhthanh/3/${id}.htm`], () => getAddressLv3({ id }), {
        // ...defaultOption,
        ...options,
    })
}