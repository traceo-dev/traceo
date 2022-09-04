import { useEffect, useState } from "react";
import isAuthenticated from "src/core/utils/isAuthenticated";
import api from "./api";

export const useApi = <T>({
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

  const execute = async (additionalParams = {}) => {
    if (isAuthenticated()) {
      try {
        setIsLoading(true);
        const resp = await api[method](url, { ...params, ...additionalParams });
        setData(resp);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { data, isLoading, isError, execute };
};
