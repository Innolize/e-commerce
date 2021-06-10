import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IDiskStorage, ServerError } from "../../../types";

export default function useCreateDiskStorage() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/disk-storage", values)
        .then((res: AxiosResponse<IDiskStorage>) => res.data)
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
      onSuccess: () => {
        queryClient.invalidateQueries("disk_storage");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("disk_storage");
      },
    }
  );
}
