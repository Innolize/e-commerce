import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "src/services/api";
import { apiOptions, ApiOptions } from "./apiOptions";

export default function useGetById<T>(option: ApiOptions, id: string) {
  const queryClient = useQueryClient();
  return useQuery<T, AxiosError>(
    [apiOptions[option].cacheString, id],
    () =>
      api
        .get(apiOptions[option].route + "/" + id)
        .then((res: AxiosResponse<T>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      initialData: () => {
        const cacheResults = queryClient.getQueryData<any>(apiOptions[option].cacheString);
        if (cacheResults) {
          return cacheResults.results.find((d: any) => d.id === parseInt(id));
        }
        return;
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
