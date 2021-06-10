import { AxiosError } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { ICategory } from "src/types";
import api from "../../services/api";

export default function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) =>
      api
        .delete(`/api/category/${id}`)
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
      onMutate: async (categoryToDelete) => {
        await queryClient.cancelQueries("categories");
        const previousCategory = queryClient.getQueryData("categories");
        queryClient.setQueryData("categories", (oldCategories: any) => {
          const newCategory = oldCategories.filter(
            (category: ICategory) => category.id !== categoryToDelete
          );
          return newCategory;
        });
        return { previousCategory };
      },
      onSettled: () => {
        queryClient.invalidateQueries("categories");
      },
      onError: (e: AxiosError, _, context: any) => {
        console.error(e);
        queryClient.setQueryData("categories", context.previousCategory);
      },
    }
  );
}
