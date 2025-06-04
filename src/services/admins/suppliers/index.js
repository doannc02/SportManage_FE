import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"
import { defaultOption } from "../../../configs/reactQuery"

export const getSupplierList = async (
    {
        pageSize,
        pageNumber,
        keyword
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/suppliers/paging',
        params: {
            pageSize,
            pageNumber,
            keyword
        }
    })
    return data
}

export const useQuerySuppliersList = (
    { pageSize, pageNumber, keyword },
    options
) => {
    return useQuery(
        ['/api/suppliers/paging', pageSize, pageNumber, keyword],
        () => getSupplierList({ pageSize, pageNumber, keyword }),
        {
            ...defaultOption,
            ...options,
        }
    );
}