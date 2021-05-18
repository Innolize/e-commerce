import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { ICabinet } from "src/types";
import api from "../../../services/api";

export default function useCabinets(enabled: boolean) {
  return useQuery(
    "cabinets",
    () =>
      api
        .get("/api/cabinet")
        .then((res: AxiosResponse<ICabinet[]>) => res.data),
    { enabled }
  );
}
