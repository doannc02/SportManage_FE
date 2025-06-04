import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"

export const getInfoCurrentCustomer = async (
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/customers/current`,
    })
    return data
}

export const useQueryInfoCurrentCustomer = (
    options
) => {
    return useQuery(['/api/customers/current'], () => getInfoCurrentCustomer(), {
        // ...defaultOption,
        ...options,
    })
}
