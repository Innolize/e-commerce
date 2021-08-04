import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "src/services/api";
import { ServerError } from "src/types";
import { apiRoutes, IApiRoutes } from "./apiRoutes";

export default function useEdit<T>(option: IApiRoutes, id: string | number) {
  const queryClient = useQueryClient();

  return useMutation(
    (values: FormData) =>
      api
        .put(apiRoutes[option].route + `/${id}`, values)
        .then((res: AxiosResponse<T>) => res.data)
        .catch((error: AxiosError<ServerError | string>) => {
          if (error.response) {
            if (typeof error.response.data === "string") {
              throw new Error(error.response.data);
            }
            if (error.response.data.errors) {
              throw new Error(Object.values(error.response.data.errors[0])[0]);
            }
            throw error.response;
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSettled: () => {
        queryClient.invalidateQueries(apiRoutes[option].cacheString);
        queryClient.invalidateQueries("cart");
      },
      onError: (e: AxiosError) => {},
    }
  );
}
