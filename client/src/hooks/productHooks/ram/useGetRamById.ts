import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IRam } from "../../../types";

export default function useGetRamId(ramId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["rams", ramId],
    () =>
      api
        .get(`/api/ram/${ramId}`)
        .then((res: AxiosResponse<IRam>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      initialData: () => {
        return queryClient
          .getQueryData<any>("rams")
          ?.find((b: any) => b.id === parseInt(ramId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
