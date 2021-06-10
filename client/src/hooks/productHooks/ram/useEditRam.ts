import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IRam } from "src/types";
import api from "../../../services/api";

export default function useEditRam() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/ram/`, values)
        .then((res: AxiosResponse<IRam>) => res.data)
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
        queryClient.invalidateQueries("rams");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
