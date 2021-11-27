import { AxiosError, AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useQueryClient, useMutation } from "react-query";
import api from "src/services/api";
import { ServerError } from "src/types";
import { apiRoutes, IApiRoutes } from "./apiRoutes";

export default function useCreate<T>(option: IApiRoutes) {
  const queryClient = useQueryClient();

  return useMutation(
    (values: FormData) =>
      api
        .post(apiRoutes[option].route, values)
        .then((res: AxiosResponse) => {
          // converts the response to camelCase and this creates our ICart entity
          const camelCaseResponse: T = camelcaseKeys(res.data, { deep: true });
          return camelCaseResponse;
        })
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
      },
      onError: (e: AxiosError) => {
        console.error(e);
      },
    }
  );
}
