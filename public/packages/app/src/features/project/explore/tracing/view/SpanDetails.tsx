import { CopyOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { Dictionary, TreeSpan } from "@traceo/types";
import { Col, Row } from "@traceo/ui";
import dayjs from "dayjs";
import { FC, useMemo, useState } from "react";
import { copyToClipboad } from "../../../../../core/utils/clipboard";

interface DetailsRowProps {
  name: string;
  value: string | number | undefined | unknown;
  copyable?: boolean;
}
const DetailRow = ({ name, value, copyable }: DetailsRowProps) => {
  return (
    <tr className="text-[13px] border-[5px] border-solid border-primary">
      <td className="min-w-[280px] px-2 font-semibold py-2">{name}</td>
      <td className="bg-secondary w-full px-2 font-normal">
        <span>{value}</span>
        {copyable && (
          <CopyOutlined className="icon-btn" onClick={() => copyToClipboad(value, true)} />
        )}
      </td>
    </tr>
  );
};

interface ExpandSectionProps {
  name: string;
}
const ExpandSection: FC<ExpandSectionProps> = ({ name, children }) => {
  const [expanded, setExpand] = useState<boolean>(false);

  return (
    <Col className="py-2">
      <Row gap="x-2" className="pl-3 cursor-pointer" onClick={() => setExpand(!expanded)}>
        <span className="text-[10px]">{expanded ? <DownOutlined /> : <RightOutlined />}</span>
        <span className="text-[13px] font-semibold">{name}</span>
      </Row>
      {expanded && <div className="px-12">{children}</div>}
    </Col>
  );
};

const DetailsWrapper: FC = ({ children }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
);

interface DetailsProps {
  span: TreeSpan;
}
export const SpanDetails = ({ span }: DetailsProps) => {
  const attributes = useMemo<Dictionary<string>>(() => {
    return JSON.parse(span.attributes);
  }, [span]);

  // const events = useMemo(() => {
  //   return JSON.parse(span.events);
  // }, [span]);

  // const hrTimeToString = (hrTime: HrTime) => {
  //   const time = hrTime[0] + hrTime[1] / 1e9;
  //   return dayjs.unix(time).format("YYYY-MM-DD HH:mm:ss.SSS");
  // };

  const getFieldsCount = (obj: object) => {
    return Object.keys(obj).length;
  };

  return (
    <Col>
      <DetailsWrapper>
        <DetailRow name="Name" value={span.name} />
        <DetailRow name="Service name" value={span.service_name} />
        <DetailRow name="Span ID" value={span.span_id} copyable />
        <DetailRow name="Trace ID" value={span.trace_id} copyable />
        <DetailRow
          name="Parent Span ID"
          value={span.parent_span_id}
          copyable={!!span.parent_span_id}
        />
        <DetailRow name="Child count" value={span.childrens.length} />
        <DetailRow
          name="Start time"
          value={`${dayjs.unix(span.start_time).format("YYYY-MM-DD HH:mm:ss:SSS")} (${
            span.start_time
          })`}
        />
        <DetailRow
          name="End time"
          value={`${dayjs.unix(span.end_time).format("YYYY-MM-DD HH:mm:ss:SSS")} (${
            span.end_time
          })`}
        />
        <DetailRow name="Duration" value={`${span.duration.toFixed(2)}ms`} />
      </DetailsWrapper>

      <ExpandSection name={`Attributes (${getFieldsCount(attributes)})`}>
        <DetailsWrapper>
          {Object.entries(attributes).map(([key, value]) => (
            <DetailRow name={key} value={value} />
          ))}
        </DetailsWrapper>
      </ExpandSection>

      {/* <ExpandSection name={`Events (${getFieldsCount(events)})`}>
        <DetailsWrapper>
          {events.map((e) => {
            const attrs = e?.attributes ? JSON.parse(e.attributes) : {};

            return (
              <ExpandSection name={e.name}>
                <DetailRow name="Time" value={hrTimeToString(e.time)} />

                {attrs &&
                  Object.entries(attrs).map(([key, value]) => (
                    <DetailRow name={key} value={value} />
                  ))}
              </ExpandSection>
            );
          })}
        </DetailsWrapper>
      </ExpandSection> */}
    </Col>
  );
};
