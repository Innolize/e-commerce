import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IDiskStorage } from "../../../types";

export default function useGetDiskStorageById(diskStorageId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["disk_storage", diskStorageId],
    () =>
      api
        .get(`/api/disk-storage/${diskStorageId}`)
        .then((res: AxiosResponse<IDiskStorage>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      initialData: () => {
        return queryClient
          .getQueryData<any>("disk_storage")
          ?.find((b: any) => b.id === parseInt(diskStorageId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
