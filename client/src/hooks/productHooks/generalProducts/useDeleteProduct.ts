import { AxiosError } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IProduct } from "src/types";
import api from "../../../services/api";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) =>
      api
        .delete(`/api/product/${id}`)
        .then((res) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onMutate: async (productToDelete) => {
        // Optimistic update on delete.
        await queryClient.cancelQueries("products");
        const previousProduct = queryClient.getQueryData("products");
        queryClient.setQueryData("products", (oldProducts: any) => {
          const newProduct = oldProducts.filter(
            (product: IProduct) => product.id !== productToDelete
          );
          return newProduct;
        });
        return { previousProduct };
      },
      onSettled: () => {
        queryClient.invalidateQueries("products");
      },
      onError: (e: AxiosError, _, context: any) => {
        console.error(e);
        queryClient.setQueryData("products", context.previousProduct);
      },
    }
  );
}
