import { authApi } from '../../../configs/auth'


export const postRefreshToken = async (
    refreshToken,
    accessToken
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/refresh-token',
        data: {
            refreshToken,
            accessToken
        },
    })
    return data
}