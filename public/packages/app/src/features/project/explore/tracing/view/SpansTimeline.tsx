import { Span } from "@traceo/types";
import { calculateLeftSpacePercentage } from "./utils";
import styled from "styled-components";
import { Row } from "@traceo/ui";

const DurationBar = styled.div<{ width: number; left: number }>`
  height: 2px;
  background-color: green;
  position: relative;
  width: ${(p) => p.width}%;
  left: ${(p) => p.left}%;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  width: 100%;
  position: relative;
  border: 1px solid var(--color-bg-secondary);
`;

interface Props {
  root: Span;
  spans: Span[];
}
export const SpansTimeline = ({ spans, root }: Props) => {
  return (
    <Timeline>
      {spans.map((span, index) => {
        const width = (span.duration / root.duration) * 100;
        const left = calculateLeftSpacePercentage(
          root.start_time,
          root.duration,
          span.start_time
        );

        return (
          <Row key={index}>
            <DurationBar width={width} left={left} />
          </Row>
        );
      })}
    </Timeline>
  );
};
