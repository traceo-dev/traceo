import { TimeRange, Setter, DashboardPanel } from "@traceo/types";

interface PanelDimension {
  width: number;
  height: number;
}

export interface PanelProps {
  isEditable: boolean;
  isRemoveMode: boolean;
  dimensions: PanelDimension;
  panel: DashboardPanel;
  ranges: TimeRange;
  onChangeTimeRange: Setter<TimeRange>;
  onRemovePanel: () => void;
}
