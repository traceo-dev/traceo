import { useReactQuery } from "../../../../../core/hooks/useReactQuery";
import { useParams } from "react-router-dom";
import { RefetchOptions } from "react-query";
import { DashboardPanel } from "@traceo/types";

interface HookResponse {
  panel: DashboardPanel;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: (options?: RefetchOptions) => void;
}

export const usePanelQuery = (): HookResponse => {
  const { panelId } = useParams();
  const {
    data: datasource,
    refetch,
    isRefetching,
    isLoading,
    isError
  } = useReactQuery<DashboardPanel>({
    queryKey: [`panel_query_ds_${panelId}`],
    url: `/api/dashboard/panel/${panelId}`
  });

  return {
    panel: datasource,
    refetch,
    isLoading: isRefetching || isLoading,
    isError,
    isEmpty: !datasource
  };
};
