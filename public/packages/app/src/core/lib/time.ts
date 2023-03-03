import historyService from "./history";

const setParams = (params: Record<string, any>) => {
    const search = new URLSearchParams(historyService.location.search);
    Object.entries(params).map(([key, value]) => {
        search.set(key, value);
    });
    historyService.push({
        search: search.toString()
    });
}

export const timeService = {
    setParams
}
