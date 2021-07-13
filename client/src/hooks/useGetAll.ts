import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import api from "src/services/api";
import { ApiOptions, apiOptions } from "./apiOptions";

export default function useGetAll<T>(option: ApiOptions, offset?: number, limit?: number) {
  return useQuery(
    [apiOptions[option].cacheString, { limit, offset }],
    () => api.get(apiOptions[option].route, { params: { limit, offset } }).then((res: AxiosResponse<T>) => res.data),
    {
      staleTime: 60 * 5 * 1000, // 5 minutes
    }
  );
}
