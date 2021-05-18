import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IPowerSupply } from "../../../types";

export default function useGetPowerSupplyById(powerSupplyId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["power_supplies", powerSupplyId],
    () =>
      api
        .get(`/api/power-supply/${powerSupplyId}`)
        .then((res: AxiosResponse<IPowerSupply>) => res.data)
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
          .getQueryData<any>("power_supplies")
          ?.find((b: any) => b.id === parseInt(powerSupplyId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
