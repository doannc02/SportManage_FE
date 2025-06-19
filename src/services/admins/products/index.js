import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const getListProductInventoryLow = async () => {
  const { data } = await authApi({
    method: "get",
    url: "/api/products/inventory-low",
  });
  return data;
};

export const useQueryListProductInventoryLow = (
  options
) => {
  return useQuery(
    ["/api/products/inventory-low"],
    () => getListProductInventoryLow(),
    {
      ...defaultOption,
      ...options,
    }
  );
};