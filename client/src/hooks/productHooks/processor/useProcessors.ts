import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { IProcessor } from "src/types";
import api from "../../../services/api";

export default function useProcessors(enabled: boolean) {
  return useQuery(
    "processors",
    () =>
      api
        .get("/api/processor")
        .then((res: AxiosResponse<IProcessor[]>) => res.data),
    { enabled }
  );
}
