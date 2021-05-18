import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { ICabinet } from "src/types";
import api from "../../../services/api";

export default function useEditCabinet() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/cabinet/`, values)
        .then((res: AxiosResponse<ICabinet>) => res.data)
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
        queryClient.invalidateQueries("cabinets");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
