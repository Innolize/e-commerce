import { AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useQuery } from "react-query";
import api from "src/services/api";
import { apiRoutes, IApiRoutes } from "./apiRoutes";

export default function useGetAll<Entity>(option: IApiRoutes, offset?: number, limit?: number) {
  return useQuery(
    [apiRoutes[option].cacheString, { limit, offset }],
    () =>
      api.get(apiRoutes[option].route, { params: { limit, offset } }).then((res: AxiosResponse) => {
        // converts the response to camelCase and this creates our entity
        const camelCaseResponse: Entity = camelcaseKeys(res.data, { deep: true });
        return camelCaseResponse;
      }),
    {
      staleTime: 60 * 5 * 1000, // 5 minutes
    }
  );
}
