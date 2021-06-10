import { AxiosError } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";

export default function useDeleteDiskStorage() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) =>
      api
        .delete(`/api/disk-storage/${id}`)
        .then((res) => res.data)
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
      },
    }
  );
}
