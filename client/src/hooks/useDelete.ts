import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "src/services/api";
import { apiOptions, ApiOptions } from "./apiOptions";

export default function useDelete<T>(option: ApiOptions) {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      api
        .delete(apiOptions[option].route + "/" + id)
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
        queryClient.invalidateQueries(apiOptions[option].cacheString);
      },
      onError: (e: AxiosError) => {
        console.error(e);
      },
    }
  );
}
