import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { IRam } from "src/types";
import api from "../../../services/api";

export default function useRams() {
  return useQuery("rams", () =>
    api.get("/api/ram").then((res: AxiosResponse<IRam[]>) => res.data)
  );
}
