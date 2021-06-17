import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import api from "src/services/api";
import { ApiOptions, apiOptions } from "./apiOptions";

export default function useGetAll<T>(option: ApiOptions) {
  return useQuery(apiOptions[option].cacheString, () =>
    api.get(apiOptions[option].route).then((res: AxiosResponse<T>) => res.data)
  );
}
