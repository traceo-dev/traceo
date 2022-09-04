export const useQuery = <T>(key: string): T => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) as unknown as T;
};
