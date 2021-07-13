import { AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import api from "src/services/api";
import { ICart, IServerCartResponse } from "src/types";

interface IData {
  productId: number;
  quantity: number;
  userId: number;
  action: "update" | "add";
}

export default function useUpdateCart() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  return useMutation(
    (data: IData) =>
      api
        .post(`api/cart/${data.userId}/item`, {
          product_id: data.productId,
          quantity: data.quantity,
          user_id: data.userId,
        })
        .then((res: AxiosResponse<IServerCartResponse>) => {
          // converts the response to camelCase and this creates our ICart entity
          const camelCaseResponse: ICart = camelcaseKeys(res.data, { deep: true });
          return camelCaseResponse;
        }),
    {
      mutationKey: "updating_cart",
      retry: false,
      onSuccess: (cart, data) => {
        queryClient.setQueryData("cart", cart);
        if (data.action === "add") {
          enqueueSnackbar("Product added to cart", { variant: "success" });
          history.push("/cart");
        }
      },
      onError: (err) => {
        enqueueSnackbar("Error. Could not update cart item.", { variant: "error" });
      },
    }
  );
}
