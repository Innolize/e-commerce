import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";
import api from "src/services/api";
import { ICart } from "src/types";

interface IData {
  userId: number;
  productId: number;
}

interface IResponse {
  message: string;
}

export default function useRemoveCartItem() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(
    (data: IData) =>
      api.delete(`api/cart/${data.userId}/item/${data.productId}`).then((res: AxiosResponse<IResponse>) => res.data),
    {
      retry: false,
      onMutate: async (data) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries("cart");

        // Snapshot the previous value
        const previousCart = queryClient.getQueryData<ICart>("cart");

        // Optimistically update to the new value
        if (previousCart) {
          queryClient.setQueryData("cart", () => {
            const productIndex = previousCart.cartItems.findIndex((product) => product.productId === data.productId);
            previousCart.cartItems.splice(productIndex, 1);
            return previousCart;
          });
        }

        // Return a context object with the snapshotted value
        return { previousCart };
      },
      onSuccess: () => {
        enqueueSnackbar("Cart item removed successfully", { variant: "success" });
      },
      onSettled: () => {
        queryClient.invalidateQueries("cart");
      },
      onError: (e, data, context: any) => {
        queryClient.setQueryData("cart", context.previousTodos);
        enqueueSnackbar("Error. Could not remove the cart item.", { variant: "error" });
      },
    }
  );
}
