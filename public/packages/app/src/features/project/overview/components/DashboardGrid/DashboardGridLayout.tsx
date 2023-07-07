import { FC } from "react";
import { Responsive, WidthProvider, GridLayout } from "react-grid-layout";
import {
  GRID_MARGIN,
  GRID_PADDING,
  GRID_BREAKPOINTS,
  GRID_COLS,
  GRID_ROW_HEIGHT
} from "../../utils";

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface GridLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Props {
  layout: GridLayout[];
  isEditable?: boolean;
  handleLayoutChange: (layout: GridLayout[]) => void;
  handleResize: (layout: GridLayout[], oldItem: any, newItem: any) => void;
}

export const DashboardGridLayout: FC<Props> = ({
  layout,
  handleLayoutChange,
  handleResize,
  isEditable,
  children
}) => {
  return (
    <ResponsiveGridLayout
      layouts={{ lg: layout }}
      margin={GRID_MARGIN}
      containerPadding={GRID_PADDING}
      breakpoints={GRID_BREAKPOINTS}
      cols={GRID_COLS}
      rowHeight={GRID_ROW_HEIGHT}
      onLayoutChange={handleLayoutChange}
      onResize={handleResize}
      onResizeStop={handleResize}
      draggableHandle=".drag-handle"
      isDraggable={isEditable}
      isResizable={isEditable}
      useCSSTransforms={false}
      isBounded
    >
      {children}
    </ResponsiveGridLayout>
  );
};
