import { useEffect, useState } from "react";
import { ApiResponse } from "../../types/api";
import api from "../lib/api";

export const useRequest = <T>({
  method = "get",
  url,
  params = {},
  executeOnInit = true
}): { data: T; isLoading: boolean; isError: boolean; execute: () => void } => {
  const [data, setData] = useState<T>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    executeOnInit && execute();
  }, []);

  const execute = async () => {
    try {
      setIsLoading(true);
      const resp: ApiResponse<T> = await api[method](url, params);
      setData(resp?.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, execute };
};
