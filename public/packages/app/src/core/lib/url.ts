import historyService from "./history";

const setParams = (params: Record<string, any>) => {
  const search = new URLSearchParams(window.location.search);
  Object.entries(params).map(([key, value]) => {
    search.set(key, value);
  });
  historyService.push({
    pathname: window.location.pathname,
    search: search.toString()
  });
};

const getParam = <T>(param: string) => {
  const search = new URLSearchParams(window.location.search);
  return search.get(param) as T;
}

export const urlService = {
  setParams,
  getParam
};
