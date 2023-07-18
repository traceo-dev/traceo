import { Span } from "@traceo/types";
import { useMemo } from "react";
import { calculateLeftSpacePercentage } from "./utils";
import styled from "styled-components";

interface Props {
  isRootSpan: boolean;
  root: Span;
  span: Span;
}

const Bar = styled.div<{ isRoot: boolean; width: number; left: number }>`
  height: 8px;
  background-color: green;
  border-radius: 2px;
  position: relative;
  width: ${(p) => p.width}%;
  left: ${(p) => p.left}%;
  background-color: ${(p) => (p.isRoot ? "#7A3BEC" : "#F4AA27")};
`;

export const DurationBar = ({ isRootSpan, root, span }: Props) => {
  const width = (span.duration / root.duration) * 100;

  const leftSpace = useMemo(() => {
    return calculateLeftSpacePercentage(root.start_time, root.duration, span.start_time);
  }, [root, span]);

  return <Bar isRoot={isRootSpan} width={width} left={leftSpace} />;
};
