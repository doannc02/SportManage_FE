import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const getBrandList = async ({ pageSize, pageNumber, keyword }) => {
  const { data } = await authApi({
    method: "get",
    url: "/api/brands/paging",
    params: {
      pageSize,
      pageNumber,
      keyword,
    },
  });
  return data;
};

export const useQueryBrandsList = (
  { pageSize, pageNumber, keyword },
  options
) => {
  return useQuery(
    ["/api/brands/paging", pageSize, pageNumber, keyword],
    () => getBrandList({ pageSize, pageNumber, keyword }),
    {
      ...defaultOption,
      ...options,
    }
  );
};

export const getDetailBrand = async ({ id }) => {
  const { data } = await authApi({
    method: "get",
    url: `/api/brands/${id}`,
    params: {
      id,
    },
  });
  return data;
};

export const useQueryDetailBrand = ({ id }, options) => {
  return useQuery(
    ["/api/brands/detail", id],
    () =>
      getDetailBrand({
        id,
      }),
    {
      ...defaultOption,
      ...options,
    }
  );
};

export const postBrand = async (input) => {
  const { data } = await authApi({
    method: "post",
    url: "/api/brands",
    data: input,
  });
  return data;
};

export const putBrand = async (input) => {
  const { data } = await authApi({
    method: "put",
    url: "/api/brands",
    data: input,
  });
  return data;
};

export const deleteBrand = async ({ id }) => {
  const { data } = await authApi({
    method: "delete",
    url: `/api/brands/${id}`,
    data: id,
  });
  return data;
};
