import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IProcessor } from "../../../types";

export default function useGetProcessorById(processorId: string) {
  const queryClient = useQueryClient();
  return useQuery<IProcessor, AxiosError>(
    ["processors", processorId],
    () =>
      api
        .get(`/api/processor/${processorId}`)
        .then((res: AxiosResponse<IProcessor>) => res.data)
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
          .getQueryData<IProcessor[]>("processors")
          ?.find((b: IProcessor) => b.id === parseInt(processorId));
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
