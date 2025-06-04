import { authApi } from '../../../configs/auth'

export const postLogin = async (
    username,
    password
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/login',
        data: {
            username,
            password
        },
    })
    return data
}
