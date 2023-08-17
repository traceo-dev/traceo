import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Row, Col } from "@traceo/ui";
import { useState } from "react";
import { SpanDetails } from "./SpanDetails";
import { Span, TreeSpan, isEmpty } from "@traceo/types";
import { DurationBar } from "./DurationBar";
import styled from "styled-components";
import { parseDuration } from "../utils";

const SpanWrapper = styled.div`
  display: flex;
  cursor: pointer;
  line-height: 1.25rem;

  background-color: ${(p) => (p.expanded ? "var(--color-bg-secondary)" : "transparent")};

  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;

const SpanDetailsWrapper = styled.div`
  border: 3px solid var(--color-bg-secondary);
  padding-top: 12px;
  padding-bottom: 12px;
`;

const SpanRowInfo = styled.div`
  display: flex;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 400;
`;

const ServiceNameSpan = styled.div`
  border-left: 4px solid ${(p) => (p.isRootSpan ? "#7A3BEC" : "#F4AA27")};
  padding-left: 8px;
  margin-left: 8px;
  font-size: 14px;
`;

interface SpanRowProps {
  root: Span;
  span: TreeSpan;
  level?: number;
  isRootSpan: boolean;
  left: string;
  right: string;
}

export const SpanRow = ({
  root = undefined,
  span = undefined,
  isRootSpan = false,
  level = 0,
  left = undefined,
  right = undefined
}: SpanRowProps) => {
  const [expanded, setExpanded] = useState<boolean>(isRootSpan);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);

  const hasChildrens = !isEmpty(span.childrens);
  const isShowedChildrens = expanded && hasChildrens;
  const childrens = span.childrens;

  const expandIcon = hasChildrens && (expanded ? <DownOutlined /> : <RightOutlined />);

  return (
    <Col>
      <SpanWrapper expanded={expandedDetails}>
        <SpanRowInfo style={{ width: left }}>
          {Array.from({ length: level }, (_, index) => (
            <div key={index} className="indent" onClick={() => setExpanded(!expanded)} />
          ))}

          <Row className="ml-1 py-1">
            {/* TODO: use styled-components */}
            <div
              onClick={() => setExpanded(!expanded)}
              className="text-[9px] hover:text-white"
              style={{ paddingLeft: hasChildrens ? undefined : "9px" }}
            >
              {expandIcon}
            </div>
            <ServiceNameSpan
              isRootSpan={isRootSpan}
              onClick={() => setExpandedDetails(!expandedDetails)}
            >
              {span.service_name}
            </ServiceNameSpan>
            <span className="pl-2 text-xs text-gray-600">
              {span.name} ({parseDuration(span.duration)})
            </span>
          </Row>
        </SpanRowInfo>
        <Row
          onClick={() => setExpandedDetails(!expandedDetails)}
          style={{ width: right }}
          className="border-left border-bottom overflow-x-auto"
        >
          <DurationBar isRootSpan={isRootSpan} root={root} span={span} />
        </Row>
      </SpanWrapper>

      {expandedDetails && (
        <SpanDetailsWrapper>
          <SpanDetails span={span} />
        </SpanDetailsWrapper>
      )}

      {isShowedChildrens &&
        childrens.map((child, index) => (
          <SpanRow
            key={index}
            left={left}
            right={right}
            root={root}
            level={level + 1}
            span={child}
            isRootSpan={false}
          />
        ))}
    </Col>
  );
};
