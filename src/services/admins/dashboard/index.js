import { useQuery } from "react-query";
import { authApi } from "../../../configs/auth";
import { defaultOption } from "../../../configs/reactQuery";

export const getDataAdminDashboard = async ({ startDate, endDate }) => {
  const { data } = await authApi({
    method: "get",
    url: "/api/admin-dashboards/chart",
    params: {
        startDate,
        endDate,
    },
  });
  return data;
};

export const useQueryDataChart = (
  { startDate, endDate },
  options
) => {
  return useQuery(
    ["/api/admin-dashboards/chart", startDate, endDate],
    () => getDataAdminDashboard({ startDate, endDate }),
    {
      ...defaultOption,
      ...options,
    }
  );
};