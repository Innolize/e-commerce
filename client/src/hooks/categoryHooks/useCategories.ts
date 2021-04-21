import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import api from "../../services/api";
import { ICategory } from "../../types";

export default function useCategories() {
  return useQuery("categories", () =>
    api.get("/api/category").then((res: AxiosResponse<ICategory[]>) => res.data)
  );
}
