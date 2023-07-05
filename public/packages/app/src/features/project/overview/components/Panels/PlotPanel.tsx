import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { BaseMetricChart } from "../../../../../core/components/UPlot/BaseMetricChart";
import { useReactQuery } from "../../../../../core/hooks/useReactQuery";
import { RemovePanelConfirm } from "../../components/RemovePanelConfirm";
import { GRID_BASE_PANEL_HEIGHT, GRID_MARGIN, GRID_ROW_HEIGHT } from "../../utils";
import { PanelProps } from "./types";
import { getXAxisFormatter } from "./formatters";

export const PlotPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  dimensions = undefined,
  isEditable = false,
  isRemoveMode = false,
  onChangeTimeRange = undefined,
  onRemovePanel = undefined
}: PanelProps) => {
  const navigate = useNavigate();

  const { id, dashboardId } = useParams();
  const [isHover, setHover] = useState<boolean>(false);

  const seriesFields = panel.config.series.map(({ field }) => field) || [""];
  const { data, refetch, isLoading, isRefetching } = useReactQuery<any>({
    queryKey: [`metric_ds_${panel.id}`],
    url: `/api/metrics/${id}/preview/${panel.id}`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    },
    options: {
      refetchOnMount: false,
      retryOnMount: false
    }
  });

  useEffect(() => {
    refetch();
  }, [ranges, panel]);

  const calculateHeight = (h: number): number => {
    return h * (GRID_ROW_HEIGHT + GRID_MARGIN[0]) - GRID_BASE_PANEL_HEIGHT;
  };

  const onNavigate = () => {
    navigate({
      pathname: `/project/${id}/dashboard/${dashboardId}/panel/${panel.id}`,
      search: `?from=${ranges[0]}&to=${ranges[1]}`
    });
  };

  const renderOptions = () => {
    if (isRemoveMode) {
      return (
        <RemovePanelConfirm panelId={panel.id} postExecute={onRemovePanel}>
          <CloseOutlined className="text-xs cursor-pointer hover:text-yellow-600" />
        </RemovePanelConfirm>
      );
    }

    if (isHover) {
      return (
        <span
          onClick={onNavigate}
          className="hover:text-sky-600 text-xs cursor-pointer font-semibold"
        >
          View
        </span>
      );
    }

    return undefined;
  };

  return (
    <BaseDashboardPanel
      panel={panel}
      loading={isLoading || isRefetching}
      options={renderOptions()}
      setHover={setHover}
      isEditable={isEditable}
    >
      <BaseMetricChart
        height={calculateHeight(dimensions?.height ?? panel.gridPosition.h)}
        datasource={data?.datasource}
        panel={panel}
        onZoom={onChangeTimeRange}
        xFormatter={getXAxisFormatter(panel.type)}
      />
    </BaseDashboardPanel>
  );
};
