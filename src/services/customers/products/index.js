import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"
import { defaultOption } from "../../../configs/reactQuery"
import queryString from "query-string"

export const getProductList = async (
    {
        pageSize,
        pageNumber,
        keyword,
        categoryIds
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/products/paging',
        params: {
            pageSize,
            pageNumber,
            keyword,
            categoryIds
        },
        paramsSerializer: (params) => {
            // Xử lý serialization cho mảng
            return queryString.stringify(params, { arrayFormat: 'repeat' })
          }
    })
    return data
}

export const useQueryProductsList = (
    { pageSize, pageNumber, keyword, categoryIds },
    options
) => {
    return useQuery(
        ['/api/products/paging', pageSize, pageNumber, keyword, categoryIds],
        () => getProductList({ pageSize, pageNumber, keyword, categoryIds }),
        {
            // ...defaultOption,
            ...options,
        }
    );
}


export const getProductVariantList = async (
    {
        pageSize,
        pageNumber,
        keyword,
        categoryIds
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/products/variant-paging',
        params: {
            pageSize,
            pageNumber,
            keyword,
            categoryIds
        },
        paramsSerializer: (params) => {
            // Xử lý serialization cho mảng
            return queryString.stringify(params, { arrayFormat: 'repeat' })
          }
    })
    return data
}

export const useQueryProductsVariantList = (
    { pageSize, pageNumber, keyword, categoryIds },
    options
) => {
    return useQuery(
        ['/api/products/variant-paging', pageSize, pageNumber, keyword, categoryIds],
        () => getProductVariantList({ pageSize, pageNumber, keyword, categoryIds }),
        {
            ...defaultOption,
            ...options,
        }
    );
}


export const getProductDetail = async (
    {
        id
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/products/${id}`,
        params: {
            id: id
        }
    })
    return data
}

export const useQueryProductsDetail = (
    {
        id
    },
    options
) => {
    return useQuery(['/api/products/detail', id], () => getProductDetail({
        id
    }), {
        // ...defaultOption,
        ...options,
    })
}



export const getProductReview = async (
    {
        id
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/products/${id}/reviews`,
        params: {
            id: id
        }
    })
    return data
}

export const useQueryGetProductReview = (
    {
        id
    },
    options
) => {
    return useQuery(['/api/products/reviews', id], () => getProductReview({
        id
    }), {
        ...options,
    })
}



export const saveProduct = async (
    { input,
        method }
) => {
    const { data } = await authApi({
        method: method ?? 'post',
        url: '/api/products',
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
