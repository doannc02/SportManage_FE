import { useQuery } from "react-query";
import { defaultOption } from "../../../configs/reactQuery";
import { authApi } from "../../../configs/auth";

export const getAvailableVouchers = async (
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/vouchers/get-available',
    })
    return data
}

export const useQueryAvailableVouchers = (
    options
) => {
    return useQuery(
        ['/api/vouchers/get-available'],
        () => getAvailableVouchers(),
        {
            ...defaultOption,
            ...options,
        }
    );
}
