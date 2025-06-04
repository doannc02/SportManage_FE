import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"
import { defaultOption } from "../../../configs/reactQuery"

export const getBrandList = async (
    {
        pageSize,
        pageNumber,
        keyword
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/brands/paging',
        params: {
            pageSize,
            pageNumber,
            keyword
        }
    })
    return data
}

export const useQueryBrandsList = (
    { pageSize, pageNumber, keyword },
    options
) => {
    return useQuery(
        ['/api/brands/paging', pageSize, pageNumber, keyword],
        () => getBrandList({ pageSize, pageNumber, keyword }),
        {
            ...defaultOption,
            ...options,
        }
    );
}