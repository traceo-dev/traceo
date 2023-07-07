import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { PanelProps } from "./types";
import { usePanelQuery } from "./usePanelQuery";

export const StatPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  ...rest
}: PanelProps) => {
  const { data, isLoading, ...queryProps } = usePanelQuery(panel.id, ranges);
  return (
    <BaseDashboardPanel
      loading={isLoading}
      isErrorExplain={false}
      panel={panel}
      ranges={ranges}
      className="h-full"
      {...rest}
      {...queryProps}
    >
      {/* TODO: */}
      <div className="flex justify-center items-center w-full h-full">
        <span className="text-[50px] font-semibold">{data?.datasource}</span>
      </div>
    </BaseDashboardPanel>
  );
};
