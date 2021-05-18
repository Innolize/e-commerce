import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IVideoCard } from "src/types";
import api from "../../../services/api";

export default function useEditVideoCard() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/video-card/`, values)
        .then((res: AxiosResponse<IVideoCard>) => res.data)
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
        queryClient.invalidateQueries("video_cards");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
