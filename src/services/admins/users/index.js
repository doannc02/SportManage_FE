import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"
import { defaultOption } from "../../../configs/reactQuery"

export const getUserList = async (
    {
        pageSize,
        pageNumber,
        keyword
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/customers/paging',
        params: {
            pageSize,
            pageNumber,
            keyword
        }
    })
    return data
}

export const useQueryUserList = (
    { pageSize, pageNumber, keyword },
    options
) => {
    return useQuery(
        ['/api/customers/paging', pageSize, pageNumber, keyword],
        () => getUserList({ pageSize, pageNumber, keyword }),
        {
            ...defaultOption,
            ...options,
        }
    );
}

export const getRoles = async (

) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/auths/roles',

    })
    return data
}

export const useQueryRoles = (
    options
) => {
    return useQuery(
        ['/api/auths/roles',],
        () => getRoles(),
        {
            ...defaultOption,
            ...options,
        }
    );
}

export const getUserDetail = async (
    {
        id
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: `/api/customers/${id}`,
        params: {
            id: id
        }
    })
    return data
}

export const useQueryUserDetail = (
    {
        id
    },
    options
) => {
    return useQuery(['/api/customers/detail', id], () => getUserDetail({
        id
    }), {
        // ...defaultOption,
        ...options,
    })
}





export const saveUser = async (
    { input,
        method }
) => {
    const { data } = await authApi({
        method: method ?? 'post',
        url: '/api/customers',
        data: input,
    })
    return data
}


export const deleteUser = async (
    { id
    }
) => {
    const { data } = await authApi({
        method: 'delete',
        url: `/api/customers/${id}`,
        data: id,
    })
    return data
}

export const updateUserRoles = async ({
    userId,
    roleIds
}) => {
    const { data } = await authApi({
        method: 'put',
        url: `/api/customers/assign-roles`,
        data: {
            userId,
            roleIds
        },
    })
    return data
};