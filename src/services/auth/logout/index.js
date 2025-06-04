import { authApi } from '../../../configs/auth'


export const postLogout = async (
    refreshToken,
    accessToken
) => {
    const { data } = await authApi({
        method: 'post',
        url: '/logout',
        data: {
            refreshToken,
            accessToken
        },
    })

    return data
}

// {
//     "isLogoutSucess": true
// }