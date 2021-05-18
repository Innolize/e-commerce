import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { ICabinet } from "../../../types";

export default function useGetCabinetId(cabinetId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["cabinets", cabinetId],
    () =>
      api
        .get(`/api/cabinet/${cabinetId}`)
        .then((res: AxiosResponse<ICabinet>) => res.data)
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
          .getQueryData<any>("cabinets")
          ?.find((b: any) => b.id === parseInt(cabinetId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
