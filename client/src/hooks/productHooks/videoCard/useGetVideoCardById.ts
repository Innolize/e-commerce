import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IVideoCard } from "../../../types";

export default function useGetVideoCardById(videoCardId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["video_cards", videoCardId],
    () =>
      api
        .get(`/api/video-card/${videoCardId}`)
        .then((res: AxiosResponse<IVideoCard>) => res.data)
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
          .getQueryData<any>("video_cards")
          ?.find((b: any) => b.id === parseInt(videoCardId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
