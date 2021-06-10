import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { IVideoCard } from "src/types";
import api from "../../../services/api";

export default function useVideoCards() {
  return useQuery("video_cards", () =>
    api
      .get("/api/video-card")
      .then((res: AxiosResponse<IVideoCard[]>) => res.data)
  );
}
