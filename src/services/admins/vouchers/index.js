import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const getVouchers = async ({
    pageNumber = 0,
    pageSize = 20,
    keyword = '',
    startDate = '',
    endDate = ''
}
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/vouchers/get-all',
        params: {
            pageNumber,
            pageSize,
            keyword,
            startDate,
            endDate
        }
    })
    return data
}

export const useQueryVouchers = ({
    pageNumber,
    pageSize,
    keyword = '',
    startDate = '',
    endDate = ''
},
    options
) => {
    return useQuery(
        ['/api/vouchers/get-all', pageNumber, pageSize, keyword, startDate, endDate],
        () => getVouchers({
            pageNumber,
            pageSize,
            keyword,
            startDate,
            endDate
        }),
        {
            ...defaultOption,
            ...options,
        }
    );
}


export const getDetailVoucher = async ({
    id
}
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/vouchers/${id}`,
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
        ['/api/vouchers/detail', id],
        () => getDetailVoucher({
            id
        }),
        {
            ...defaultOption,
            ...options,
        }
    );
}


export const postVoucher = async (
    input
) => {
    console.log(input, 'loon')
    const { data } = await authApi({
        method: 'post',
        url: '/api/vouchers/create',
        data: input,
    })
    return data
}

export const putVoucher = async (
    input
) => {
    const { data } = await authApi({
        method: 'put',
        url: '/api/vouchers/update',
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
