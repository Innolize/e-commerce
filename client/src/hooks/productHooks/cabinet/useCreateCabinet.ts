import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { ICabinet } from "../../../types";

export default function useCreateCabinet() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/cabinet", values)
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
        console.error(e);
        queryClient.invalidateQueries("cabinets");
      },
    }
  );
}
