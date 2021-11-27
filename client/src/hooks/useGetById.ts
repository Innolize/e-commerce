import { AxiosError, AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useQuery, useQueryClient } from "react-query";
import api from "src/services/api";
import { apiRoutes, IApiRoutes } from "./apiRoutes";

export default function useGetById<Entity>(option: IApiRoutes, id?: string) {
  const queryClient = useQueryClient();
  return useQuery<Entity, AxiosError>(
    [apiRoutes[option].cacheString, id],
    () =>
      api
        .get(apiRoutes[option].route + "/" + id)
        .then((res: AxiosResponse) => {
          // converts the response to camelCase and this creates our entity
          const camelCaseResponse: Entity = camelcaseKeys(res.data, { deep: true });
          return camelCaseResponse;
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      enabled: !!id,
      initialData: () => {
        // this might be pointless after the pagination update since we need 'offset' on the query key
        if (id) {
          const cacheResults = queryClient.getQueryData<any>([apiRoutes[option].cacheString]);
          if (cacheResults) {
            return cacheResults.results.find((d: any) => d.id === parseInt(id));
          }
        }
        return;
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
