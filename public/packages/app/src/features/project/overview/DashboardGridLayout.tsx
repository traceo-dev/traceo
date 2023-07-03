import { ExpandOutlined } from "@ant-design/icons";
import { FC } from "react";
import ReactGridLayout, { Responsive, WidthProvider, GridLayout } from "react-grid-layout";
import styled from "styled-components";

// const ResizeHandle = styled.div`
//   position: absolute;
//   z-index: 2;
//   bottom: 5px;
//   right: 5px;
//   color: var(--color-text-primary);
//   cursor: nwse-resize;

//   .react-resizable-hide & {
//     display: none;
//   }
// `;

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

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const MARGIN = [8, 8];
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const ROW_HEIGHT = 30;
const PADDING = [0, 0];

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
      margin={MARGIN}
      containerPadding={PADDING}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      onLayoutChange={handleLayoutChange}
      onResize={handleResize}
      onResizeStop={handleResize}
      draggableHandle=".drag-handle"
      // onDragStop={onDragStop}
      // onResizeStop={onResizeStop}
      isDraggable={isEditable}
      isResizable={isEditable}
      useCSSTransforms={false}
      isBounded
    >
      {children}
    </ResponsiveGridLayout>
  );
};
