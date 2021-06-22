import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import api from "src/services/api";
import { apiOptions } from "./apiOptions";
import { IGetProducts } from "./types";

export default function useGetProducts(offset: number, category_id?: string, name?: string, limit = 12) {
  return useQuery(
    ["products", { category_id, name, offset }],
    () =>
      api
        .get(apiOptions.product.route, { params: { category_id, name, limit, offset } })
        .then((res: AxiosResponse<IGetProducts>) => res.data),
    {
      staleTime: 60 * 1000, // 1 minute
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
