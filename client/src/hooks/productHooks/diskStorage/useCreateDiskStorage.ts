import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IDiskStorage } from "../../../types";

export default function useCreateDiskStorage() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/disk-storage", values)
        .then((res: AxiosResponse<IDiskStorage>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
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
