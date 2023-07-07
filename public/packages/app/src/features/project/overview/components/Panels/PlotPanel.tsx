import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { BaseMetricChart } from "../../../../../core/components/UPlot/BaseMetricChart";
import { PanelProps } from "./types";
import { getXAxisFormatter } from "./formatters";
import { usePanelQuery } from "./usePanelQuery";

export const PlotPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  onChangeTimeRange = undefined,
  ...rest
}: PanelProps) => {
  const { data, isLoading, refetch, ...queryProps } = usePanelQuery(panel.id, ranges);

  return (
    <BaseDashboardPanel
      panel={panel}
      loading={isLoading}
      ranges={ranges}
      {...rest}
      {...queryProps}
    >
      <BaseMetricChart
        height={rest.height}
        datasource={data?.datasource}
        panel={panel}
        onZoom={onChangeTimeRange}
        xFormatter={getXAxisFormatter(panel.type)}
      />
    </BaseDashboardPanel>
  );
};
