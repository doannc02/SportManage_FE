import { useQuery } from "react-query"
import { authApi } from "../../../configs/auth"
import { defaultOption } from "../../../configs/reactQuery"

export const getSupplierList = async (
    {
        pageSize,
        pageNumber,
        keyword
    }
) => {
    const { data } = await authApi({
        method: 'get',
        url: '/api/suppliers/paging',
        params: {
            pageSize,
            pageNumber,
            keyword
        }
    })
    return data
}

export const useQuerySuppliersList = (
    { pageSize, pageNumber, keyword },
    options
) => {
    return useQuery(
        ['/api/suppliers/paging', pageSize, pageNumber, keyword],
        () => getSupplierList({ pageSize, pageNumber, keyword }),
        {
            ...defaultOption,
            ...options,
        }
    );
}

export const getDetailSupplier = async ({ id }) => {
  const { data } = await authApi({
    method: "get",
    url: `/api/suppliers/${id}`,
    params: {
      id,
    },
  });
  return data;
};

export const useQueryDetailSupplier = ({ id }, options) => {
  return useQuery(
    ["/api/suppliers/detail", id],
    () =>
      getDetailSupplier({
        id,
      }),
    {
      ...defaultOption,
      ...options,
    }
  );
};

export const postSupplier = async (input) => {
  const { data } = await authApi({
    method: "post",
    url: "/api/suppliers",
    data: input,
  });
  return data;
};

export const putSupplier = async (input) => {
  const { data } = await authApi({
    method: "put",
    url: "/api/suppliers",
    data: input,
  });
  return data;
};

export const deleteSupplier = async ({ id }) => {
  const { data } = await authApi({
    method: "delete",
    url: `/api/suppliers/${id}`,
    data: id,
  });
  return data;
};
