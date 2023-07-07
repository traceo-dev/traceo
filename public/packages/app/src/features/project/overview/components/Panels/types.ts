import { TimeRange, Setter, DashboardPanel } from "@traceo/types";

export interface PanelProps {
  title?: string;
  isEditable: boolean;
  isRemoveMode: boolean;
  panel: DashboardPanel;
  ranges: TimeRange;
  height?: number;
  onChangeTimeRange: Setter<TimeRange>;
  options?: JSX.Element;
}
