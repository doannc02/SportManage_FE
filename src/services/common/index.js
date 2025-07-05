import { useQuery } from "react-query"
import { addressApi } from "../../configs/auth"
import axios from "axios"


export const getAddressLv1 = async (

) => {

    const { data } = await addressApi({
        method: 'get',
        url: '/api-tinhthanh/1/0.htm',
    })
    return data
}

export const useQueryAddressLv1 = (
    options
) => {
    return useQuery(['/api-tinhthanh/1/0.htm'], () => getAddressLv1(), {
        // ...defaultOption,
        ...options,
    })
}


export const getAddressLv2 = async (
    { id }
) => {
    const { data } = await addressApi({
        method: 'get',
        url: `/api-tinhthanh/2/${id}.htm`,
    })
    return data
}

export const useQueryAddressLv2 = (
    { id },
    options
) => {
    return useQuery([`/api-tinhthanh/2/${id}.htm`], () => getAddressLv2({ id }), {
        // ...defaultOption,
        ...options,
    })
}


export const getAddressLv3 = async (
    { id }
) => {
    const { data } = await addressApi({
        method: 'get',
        url: `/api-tinhthanh/3/${id}.htm`,
    })
    return data
}

export const useQueryAddressLv3 = (
    { id },
    options
) => {
    return useQuery([`/api-tinhthanh/3/${id}.htm`], () => getAddressLv3({ id }), {
        // ...defaultOption,
        ...options,
    })
}



export const getIPAddress = async () => {
    const res = await axios("https://api.ipify.org?format=json");
    return res.data.ip;
};


export const useQueryIPAddress = (
    options
) => {
    return useQuery(["https://api.ipify.org?format=json"], () => getIPAddress(), {
        // ...defaultOption,
        ...options,
    })
}

export const getIPLocation = async (ipAddress, apiKey) => {
    const res = await axios(`https://apiip.net/api/check?ip=${ipAddress}&accessKey=${apiKey}`);
    return res.data;
};

export const useQueryIPLocation = (
    { ipAddress, apiKey },
    options
) => {
    return useQuery([`https://apiip.net/api/check?ip=${ipAddress}&accessKey=${apiKey}`], () => getIPLocation(ipAddress, apiKey), {
        enabled: !!ipAddress && !!apiKey,
        ...options,
    })
}
