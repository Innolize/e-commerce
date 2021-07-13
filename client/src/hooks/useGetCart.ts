import { AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useQuery } from "react-query";
import api from "src/services/api";
import { ICart, IServerCartResponse } from "src/types";

const useGetCart = (userId?: number | string) => {
  return useQuery(
    "cart",
    () =>
      api.get("/api/cart/" + userId).then((res: AxiosResponse<IServerCartResponse>) => {
        // converts the response to camelCase and this creates our ICart entity
        const camelCaseResponse: ICart = camelcaseKeys(res.data, { deep: true });
        return camelCaseResponse;
      }),
    {
      enabled: !!userId,
      staleTime: 1000 * 60,
    }
  );
};

export default useGetCart;
