import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "src/services/api";
import { apiRoutes, IApiRoutes } from "./apiRoutes";

export default function useDelete<T>(option: IApiRoutes) {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      api
        .delete(apiRoutes[option].route + "/" + id)
        .then((res: AxiosResponse<T>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSettled: () => {
        queryClient.invalidateQueries(apiRoutes[option].cacheString);
      },
      onError: (e: AxiosError) => {
        console.error(e);
      },
    }
  );
}
