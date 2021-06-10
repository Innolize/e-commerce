import { AxiosError } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";

export default function useDeleteProcessor() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) =>
      api
        .delete(`/api/processor/${id}`)
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
        queryClient.invalidateQueries("processors");
      },
      onError: (e: AxiosError) => {
        console.error(e);
      },
    }
  );
}
