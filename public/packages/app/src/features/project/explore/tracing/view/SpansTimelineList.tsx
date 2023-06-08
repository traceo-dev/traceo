import { Span } from "@traceo/types";
import { Col } from "@traceo/ui";
import { useMemo, useState } from "react";
import { createSpansTree } from "./utils";
import { TimelineHeader } from "./TimelineHeader";
import { SpanRow } from "./SpanRow";

interface Props {
  root: Span;
  spans: Span[];
}

const MAX_LEFT_WIDTH = "25%";
const MAX_RIGHT_WIDTH = "75%";

export const SpansTimelineList = ({ root, spans }: Props) => {
  const [leftWidth, setLeftWidth] = useState(MAX_LEFT_WIDTH);
  const [rightWidth, setRightWidth] = useState(MAX_RIGHT_WIDTH);

  const tree = useMemo(() => {
    return createSpansTree(spans);
  }, [spans, root]);

  return (
    <Col>
      <TimelineHeader
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
        rightWidth={rightWidth}
        setRightWidth={setRightWidth}
        root={root}
      />
      <Col>
        {tree.map((span, index) => (
          <SpanRow
            left={leftWidth}
            right={rightWidth}
            root={root}
            span={span}
            key={index}
            isRootSpan={index === 0}
          />
        ))}
      </Col>
    </Col>
  );
};
