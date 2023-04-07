import { ApiResponse, Dictionary } from "@traceo/types";
import { useQuery, UseQueryOptions } from "react-query";
import api from "../lib/api";

export type QueryClientParams<T> = {
  queryKey: string[];
  url: string;
  params?: Dictionary<string | string[] | number | number[] | undefined>;
  options?: UseQueryOptions<T, unknown, T, string[]>;
};
export function useReactQuery<T>({
  queryKey = [],
  url = "",
  options = {},
  params = {}
}: QueryClientParams<ApiResponse<T>>) {
  const query = useQuery(queryKey, () => api.get<ApiResponse<T>>(url, params), options);

  return {
    ...query,
    data: query.data?.data
  };
}
