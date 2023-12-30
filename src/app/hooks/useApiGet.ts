import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { get } from "./methods";

export const useApiGet = <T extends unknown>(
  path: string,
  options?: UseQueryOptions<T>
) => {
  return useQuery<T>({
    queryKey: [path],
    queryFn: () => get(path),
    initialData: [] as T,
    ...options,
  });
};
