import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IMotherboard } from "../../../types";

export default function useGetMotherboardById(motherboardId: string) {
  const queryClient = useQueryClient();
  return useQuery<IMotherboard, AxiosError>(
    ["motherboards", motherboardId],
    () =>
      api
        .get(`/api/motherboard/${motherboardId}`)
        .then((res: AxiosResponse<IMotherboard>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      initialData: () => {
        return queryClient
          .getQueryData<IMotherboard[]>("motherboards")
          ?.find((b: IMotherboard) => b.id === parseInt(motherboardId));
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
