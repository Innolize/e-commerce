import { AxiosError } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IBrand } from "src/types";
import api from "../../services/api";

export default function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) =>
      api
        .delete(`/api/brand/${id}`)
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
      onMutate: async (brandToDelete) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries("brands");

        // Snapshot the previous value
        const previousBrands = queryClient.getQueryData("brands");

        // Optimistically update to the new value
        queryClient.setQueryData("brands", (oldBrands: any) => {
          const newBrands = oldBrands.filter(
            (brand: IBrand) => brand.id !== brandToDelete
          );
          return newBrands;
        });

        // Return a context object with the snapshotted value
        return { previousBrands };
      },
      onSettled: () => {
        queryClient.invalidateQueries("brands");
      },
      onError: (e: AxiosError, _, context: any) => {
        console.error(e);
        queryClient.setQueryData("brands", context.previousBrands);
      },
    }
  );
}
