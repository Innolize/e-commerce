import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import api from "src/services/api";
import { apiOptions } from "./apiOptions";
import { IGetProducts } from "./types";

export default function useGetProducts(
  page: string | null,
  category_id: string | null,
  name: string | null,
  limit = 12
) {
  const offset = page ? (Number(page) - 1) * limit : 0;
  const params = {
    category_id,
    name,
    limit,
    offset,
  };

  // deletes empty strings
  Object.keys(params).forEach((key) => {
    if (!params[key]) delete params[key];
  });

  return useQuery(
    ["products", { category_id, name, offset }],
    () => api.get(apiOptions.product.route + "/", { params }).then((res: AxiosResponse<IGetProducts>) => res.data),
    {
      retry: false,
      staleTime: 60 * 5 * 1000, // 5 minutes
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
