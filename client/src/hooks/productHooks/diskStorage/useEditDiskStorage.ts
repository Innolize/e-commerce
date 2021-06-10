import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IDiskStorage } from "src/types";
import api from "../../../services/api";

export default function useEditDiskStorage() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/disk-storage/`, values)
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
        console.log(e);
      },
    }
  );
}
