import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"
import { defaultOption } from "../../../configs/reactQuery"

export const getCategoryList = async (
    {
        pageSize,
        pageNumber,
        keyword
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/categories/paging',
        params: {
            pageSize,
            pageNumber,
            keyword
        }
    })
    return data
}

export const useQueryCategoryList = (
    { pageSize, pageNumber, keyword },
    options
) => {
    return useQuery(
        ['/api/categories/paging', pageSize, pageNumber, keyword],
        () => getCategoryList({ pageSize, pageNumber, keyword }),
        {
            ...defaultOption,
            ...options,
        }
    );
}

export const getDetailCategory = async ({
    id
}
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/categories/${id}`,
        params: {
            id
        }
    })
    return data
}

export const useQueryDetailCategory = ({
    id
},
    options
) => {
    return useQuery(
        ['/api/categories/detail', id],
        () => getDetailCategory({
            id
        }),
        {
            ...defaultOption,
            ...options,
        }
    );
}


export const postCategory = async (
    input
) => {
    console.log(input, 'loon')
    const { data } = await authApi({
        method: 'post',
        url: '/api/categories',
        data: input,
    })
    return data
}

export const putCategory = async (
    input
) => {
    const { data } = await authApi({
        method: 'put',
        url: '/api/categories',
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
