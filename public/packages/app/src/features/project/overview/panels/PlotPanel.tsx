import { CloseOutlined, DeleteOutlined, ExpandOutlined, EyeOutlined, HolderOutlined } from "@ant-design/icons";
import { DashboardPanel as DashboardPanelType, Setter, TimeRange } from "@traceo/types";
import { Row, Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardPanel } from "src/core/components/DashboardPanel";
import { BaseMetricChart } from "src/core/components/UPlot/BaseMetricChart";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { RemovePanelConfirm } from "../components/RemovePanelConfirm";

interface Props {
  isEditable: boolean;
  isRemoveMode: boolean;
  dimensions: {
    width: number;
    height: number;
  };
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
    return h * 38 - 102;
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
      return <ExpandOutlined onClick={onNavigate} className="text-xs cursor-pointer" />;
    }

    return undefined;
  };

  return (
    <DashboardPanel
      name={panel.title}
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
