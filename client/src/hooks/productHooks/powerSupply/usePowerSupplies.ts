import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { IPowerSupply } from "src/types";
import api from "../../../services/api";

export default function usePowerSupplies() {
  return useQuery("power_supplies", () =>
    api
      .get("/api/power-supply")
      .then((res: AxiosResponse<IPowerSupply[]>) => res.data)
  );
}
