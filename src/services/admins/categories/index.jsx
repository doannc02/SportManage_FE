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