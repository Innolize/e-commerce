import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { IDiskStorage } from "src/types";
import api from "../../../services/api";

export default function useDiskStorage() {
  return useQuery("disk_storage", () =>
    api
      .get("/api/disk-storage")
      .then((res: AxiosResponse<IDiskStorage[]>) => res.data)
  );
}
