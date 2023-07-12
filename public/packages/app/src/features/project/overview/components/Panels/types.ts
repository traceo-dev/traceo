import { TimeRange, Setter, DashboardPanel, Dashboard } from "@traceo/types";

export interface PanelProps {
  title?: string;
  isEditable: boolean;
  isRemoveMode: boolean;
  isHoverOptions?: boolean;
  panel: DashboardPanel;
  dashboard?: Dashboard;
  ranges: TimeRange;
  height?: number;
  onChangeTimeRange: Setter<TimeRange>;
  options?: JSX.Element;
}
