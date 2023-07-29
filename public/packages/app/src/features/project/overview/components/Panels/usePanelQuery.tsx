import { useReactQuery } from "../../../../../core/hooks/useReactQuery";
import { QueryResponseType } from "../../utils";
import { useParams } from "react-router-dom";
import { RefetchOptions } from "react-query";
import { TimeRange } from "@traceo/types";
import dateUtils from "../../../../../core/utils/date";

interface HookResponse {
  data: QueryResponseType;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: (options?: RefetchOptions) => void;
}

export const usePanelQuery = (
  panelId: string,
  ranges: TimeRange,
  enabled = false
): HookResponse => {
  const { id } = useParams();
  const {
    data = {
      datasource: [],
      options: undefined
    },
    refetch,
    isRefetching,
    isLoading,
    isError
  } = useReactQuery<QueryResponseType>({
    queryKey: [`panel_query_ds_${panelId}`],
    url: `/api/metrics/${id}/preview/${panelId}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      tz: dateUtils.guessTz()
    },
    options: {
      refetchOnMount: false,
      retryOnMount: false,
      enabled
    }
  });

  const hasData = data && !isLoading && (data.datasource || data.datasource?.length > 0);

  return {
    data,
    refetch,
    isLoading: isRefetching || isLoading,
    isError,
    isEmpty: !hasData
  };
};
