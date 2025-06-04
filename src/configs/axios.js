

import axios from 'axios'
import queryString from 'query-string'
import { getAppToken, removeAppToken, setAppToken } from './token'
import { postLogout } from '../services/auth/logout'
import { postRefreshToken } from '../services/auth/refreshToken'
import { toastError } from '../helpers/toast'

export const requestAuth = axios.create({
    timeout: 26405,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: {
        serialize: (params) =>
            queryString.stringify(params, {
                arrayFormat: 'comma',
                skipNull: true,
                skipEmptyString: true,
            }),
    },
})

export const logoutAccount = async () => {
    try {
        const tokenAccess = getAppToken()
        if (tokenAccess) await postLogout(tokenAccess.refreshToken, tokenAccess.accessToken)
    } catch (error) {
        console.log(error)
    } finally {
        localStorage.clear()
        sessionStorage.clear()
        removeAppToken()
        window.location.replace('/login')
    }
}

const middlewareRequest = async (config) => {
    const tokenAccess = getAppToken()

    const baseHeaders = {
        'Accept-Language': 'vi',
        'Current-Domain': window.location.origin.includes('localhost')
    }

    return {
        ...config,
        headers: {
            ...config.headers,
            ...baseHeaders,
            Authorization: `Bearer ${tokenAccess?.accessToken}`,
        },
    }
}

let isRefreshing = false
let refreshSubscribers = []

const middlewareResponseError = async (error) => {
    const { config, response } = error
    const originalRequest = config

    const status = response?.status

    const errorCodes = response?.data?.error?.errorCode;

    console.log(response, 'res');

    if (!status || status === 500 || status === 503 || status === 400) {
        if (Array.isArray(errorCodes) && errorCodes.length > 0) {
            toastError(errorCodes[0]);
        } else {
            toastError("Kiểm tra kết nối đường truyền mạng!!!")
        }
    }

    if (
        status === 401
    ) {
        if (!isRefreshing) {
            isRefreshing = true
            const tokenAccess = getAppToken()

            if (tokenAccess?.refreshToken) {
                postRefreshToken(tokenAccess.refreshToken, tokenAccess.accessToken)
                    .then((res) => {
                        isRefreshing = false
                        if (res?.accessToken) {
                            setAppToken(res)
                        }
                        refreshSubscribers.map((su) => {
                            su(res.accessToken)
                        })
                    })
                    .catch((e) => {
                        console.log('e', e)
                        // logoutAccount()
                        localStorage.clear()
                        sessionStorage.clear()
                        removeAppToken()
                        window.location.replace('/')
                    })
            }
        }

        return new Promise((resolve) => {
            refreshSubscribers.push((accessToken) => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                resolve(axios(originalRequest))
            })
        })
    } else if (status === 403) {
        // toastError('Bạn không có quyền thực hiện tính năng này.')
    }

    return Promise.reject(error)
}

requestAuth.interceptors.request.use(middlewareRequest, (error) =>
    Promise.reject(error)
)

requestAuth.interceptors.response.use((res) => {
    const { data } = res

    if (data?.errorCodes) return Promise.reject(data?.errorCodes)

    return res
}, middlewareResponseError)
