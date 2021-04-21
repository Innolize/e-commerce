import { AxiosError } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";

export default function useDeleteCategory(
  sucessCallback?: Function,
  errorCallback?: Function
) {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) =>
      api
        .delete(`/api/category/${id}`)
        .then((res) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            throw new Error(error.response.data.message);
          } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        sucessCallback && sucessCallback();
      },
      onError: (e: AxiosError) => {
        console.error(e);
        errorCallback && errorCallback();
      },
    }
  );
}
