import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { BaseMetricChart } from "../../../../../core/components/UPlot/BaseMetricChart";
import { PanelProps } from "./types";
import { getXAxisFormatter } from "./formatters";
import { usePanelQuery } from "./usePanelQuery";
import { conditionClass } from "@traceo/ui";

export const PlotPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  onChangeTimeRange = undefined,
  ...rest
}: PanelProps) => {
  const { data, isLoading, isError, isEmpty } = usePanelQuery(panel.id, ranges);

  return (
    <BaseDashboardPanel
      panel={panel}
      loading={isLoading}
      ranges={ranges}
      isError={isError}
      isEmpty={isEmpty}
      className={conditionClass(isError || isEmpty, "h-full overflow-hidden")}
      bodyClassName="p-0 overflow-y-hidden"
      {...rest}
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
