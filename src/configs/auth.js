import axios from "axios"
import { requestAuth } from "./axios"

export const BASE_URL = "https://localhost:7174"

export const BASE_ADDRESS_URL = "https://esgoo.net"


export const authApi = (options) => {
    return requestAuth({
        baseURL: BASE_URL,
        ...options,
    })
}


export const addressApi = (options) => {
    return axios({
        baseURL: BASE_ADDRESS_URL,
        ...options,
    })
}