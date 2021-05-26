import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { IMotherboard } from "src/types";
import api from "../../../services/api";

export default function useMotherboards() {
  return useQuery("motherboards", () =>
    api
      .get("/api/motherboard")
      .then((res: AxiosResponse<IMotherboard[]>) => res.data)
  );
}
