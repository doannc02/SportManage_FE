import { authApi } from "../../../configs/auth"

export const createOrderUser = async (
    {
        notes,
        shippingAddressId,
        paymentMethod,
        items,
        voucherCode
    }
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/api/orders',
        data: {
            notes,
            shippingAddressId,
            paymentMethod,
            items,
            voucherCode
        }
    })
    return data
}