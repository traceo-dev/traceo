import { Card, Row, Space, Timeline, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { CodePreview } from "src/core/components/CodePreview";
import { Incident, Trace } from "src/types/incidents";
import { conditionClass, joinClasses } from "src/core/utils/classes";
import { ColumnDetail } from "src/core/components/ColumnDetail";

interface Props {
  incident: Incident;
  isInternal: boolean;
}
export const CodeTraces: FC<Props> = ({ incident, isInternal }) => {
  const [selectedTrace, setSelectedTrace] = useState<Trace>();

  useEffect(() => {
    if (!selectedTrace) {
      setSelectedTrace(incident?.traces?.[0]);
    }
  });

  const wrapTraces = () => {
    return isInternal
      ? incident?.traces?.filter((frame) => frame?.internal)
      : incident?.traces;
  };

  const details = (
    <Space direction="vertical" className="w-2/3 px-5">
      {selectedTrace?.code?.length > 0 && <CodePreview trace={selectedTrace} />}

      <Space className="w-full p-5 bg-gray-800 rounded-md" direction="vertical">
        <ColumnDetail label={"Filename"} value={selectedTrace?.filename} />
        <ColumnDetail label={"Function"} value={selectedTrace?.function} />
        <ColumnDetail label={"Line No."} value={selectedTrace?.lineNo} />
        <ColumnDetail label={"Column No."} value={selectedTrace?.columnNo} />
        <Space direction="vertical" className="w-full py-1">
          <Typography className="text-primary info-label">{"Absolute path"}</Typography>

          <Typography.Paragraph className="text-primary pr-3 font-semibold" copyable>
            {selectedTrace?.absPath}
          </Typography.Paragraph>
        </Space>
      </Space>
    </Space>
  );

  return (
    <>
      <Row className="w-full pt-8">
        <Timeline className="w-1/3">
          {wrapTraces()?.map((trace, index) => (
            <Timeline.Item
              color={trace.internal ? "#D67709" : "#1F2937"}
              key={index}
              className="pb-1"
            >
              <Card
                onClick={() => setSelectedTrace(trace)}
                className={joinClasses(
                  "m-0 p-0 default-card",
                  conditionClass(trace === selectedTrace, "border-2 border-cyan-600", ""),
                  conditionClass(trace?.code?.length === 0, "pointer-events-none")
                )}
              >
                <Typography.Text className="text-xs">{trace.absPath}</Typography.Text>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
        {details}
      </Row>
    </>
  );
};
