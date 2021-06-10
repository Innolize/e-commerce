import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { ICabinet } from "../../../types";

export default function useGetCabinetById(cabinetId: string) {
  const queryClient = useQueryClient();
  return useQuery<ICabinet, AxiosError>(
    ["cabinets", cabinetId],
    () =>
      api
        .get(`/api/cabinet/${cabinetId}`)
        .then((res: AxiosResponse<ICabinet>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      enabled: !!cabinetId,
      initialData: () => {
        return queryClient
          .getQueryData<ICabinet[]>("cabinets")
          ?.find((b: ICabinet) => b.id === parseInt(cabinetId));
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
