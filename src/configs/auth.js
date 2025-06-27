import axios from "axios"
import { requestAuth } from "./axios"
import { VITE_API_BASE_URL, VITE_BASE_ADDRESS_URL } from "./env";

export const BASE_URL = VITE_API_BASE_URL;

export const BASE_ADDRESS_URL = VITE_BASE_ADDRESS_URL


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