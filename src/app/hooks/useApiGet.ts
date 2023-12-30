import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { HttpClient } from "./http-client";

export const useApiGet = <T extends unknown>(
  path: string,
  options?: UseQueryOptions<T>
) => {
  return useQuery<T>({
    queryKey: [path],
    queryFn: () => HttpClient.get(path),
    initialData: [] as T,
    ...options,
  });
};
