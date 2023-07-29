import { forwardRef } from "react";
import styled from "styled-components";

const ScrollableWrapper = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  display: block;
  max-height: 380px !important;
`;

interface Props {
  //   Percentage of the already scrolled table height
  minTreshold?: number;
  nextSkip?: number;
  onScrollBottom: (nextSkip?: number) => void;
  children: JSX.Element;
}

export const TableLazyLoader = forwardRef<any, Props>(
  ({ children, minTreshold = 0.98, onScrollBottom, nextSkip = 0 }, ref) => {
    const handleScroll = () => {
      const table = ref["current"];
      const scrollPosition = table.scrollTop + table.clientHeight;
      const totalHeight = table.scrollHeight;

      if (scrollPosition / totalHeight >= minTreshold) {
        onScrollBottom(nextSkip);
      }
    };
    return (
      <ScrollableWrapper ref={ref} onScroll={handleScroll}>
        {children}
      </ScrollableWrapper>
    );
  }
);
