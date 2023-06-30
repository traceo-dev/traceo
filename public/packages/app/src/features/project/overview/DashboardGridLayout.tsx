import { FC } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

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
  handleLayoutChange: (layout: GridLayout[]) => void;
}

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const MARGIN = [8, 8];
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const ROW_HEIGHT = 30;

export const DashboardGridLayout: FC<Props> = ({ layout, handleLayoutChange, children }) => {
  return (
    <ResponsiveGridLayout
      layouts={{ lg: layout }}
      margin={MARGIN}
      containerPadding={[0, 0]}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      onLayoutChange={handleLayoutChange}
      // onDragStop={onDragStop}
      // onResizeStop={onResizeStop}
      // isDraggable={false}
      // isresizable={false}
      useCSSTransforms={false}
      isBounded
    >
      {children}
    </ResponsiveGridLayout>
  );
};
