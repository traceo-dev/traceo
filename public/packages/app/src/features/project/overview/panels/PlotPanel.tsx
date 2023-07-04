import { CloseOutlined } from "@ant-design/icons";
import { DashboardPanel as DashboardPanelType, Setter, TimeRange } from "@traceo/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardPanel } from "../../../../core/components/DashboardPanel";
import { BaseMetricChart } from "../../../../core/components/UPlot/BaseMetricChart";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { RemovePanelConfirm } from "../components/RemovePanelConfirm";
import { GRID_BASE_PANEL_HEIGHT, GRID_MARGIN, GRID_ROW_HEIGHT } from "../utils";

interface PanelDimension {
  width: number;
  height: number;
}
interface Props {
  isEditable: boolean;
  isRemoveMode: boolean;
  dimensions: PanelDimension;
  panel: DashboardPanelType;
  ranges: TimeRange;
  onChangeTimeRange: Setter<TimeRange>;
  onRemovePanel: () => void;
}
export const PlotPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  dimensions = undefined,
  isEditable = false,
  isRemoveMode = false,
  onChangeTimeRange = undefined,
  onRemovePanel = undefined
}: Props) => {
  const navigate = useNavigate();

  const { id, did } = useParams();
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
      pathname: `/project/${id}/dashboard/${did}/panel/${panel.id}`,
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
    <DashboardPanel
      name={panel.title}
      tooltip={panel?.description}
      loading={isLoading || isRefetching}
      options={renderOptions()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      isDraggable={isEditable}
    >
      <BaseMetricChart
        height={calculateHeight(dimensions?.height ?? panel.gridPosition.h)}
        datasource={data?.datasource}
        panel={panel}
        onZoom={onChangeTimeRange}
      />
    </DashboardPanel>
  );
};
