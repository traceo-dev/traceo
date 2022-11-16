import { Card, Col, Row, Space, Timeline, Typography } from "antd";
import { CodePreview } from "../../../../core/components/CodePreview";
import { ColumnDetail } from "../../../../core/components/ColumnDetail";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Incident, Trace } from "../../../../types/incidents";
import { PagePanel } from "../../../../core/components/PagePanel";
import { StoreState } from "../../../../types/store";

export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const isTraces = incident?.traces?.length > 0;

  return (
    <>
      {isTraces && (
        <PagePanel title="Stacktrace">
          <Space className="w-full py-5 gap-0" direction="vertical">
            <Typography.Text className="text-xl font-semibold">
              {incident?.type}
            </Typography.Text>
            <Typography.Text className="text-md">{incident?.message}</Typography.Text>
          </Space>
          <CodeTraces incident={incident} />
        </PagePanel>
      )}
    </>
  );
};

interface CodeTracesProps {
  incident: Incident;
}
const CodeTraces: FC<CodeTracesProps> = ({ incident }) => {
  const [selectedTrace, setSelectedTrace] = useState<Trace>();

  useEffect(() => {
    if (!selectedTrace) {
      setSelectedTrace(incident?.traces?.[0]);
    }
  });

  return (
    <>
      <Row gutter={[24, 0]} className="pt-12">
        <Col span={24} md={8}>
          <Timeline>
            {incident?.traces?.map((trace, index) => (
              <Timeline.Item
                color={trace.internal ? "#D67709" : "#1F2937"}
                key={index}
                className="pb-1"
              >
                <Card
                  onClick={() => setSelectedTrace(trace)}
                  className={joinClasses(
                    "m-0 p-0 default-card",
                    conditionClass(
                      trace === selectedTrace,
                      "border-2 border-cyan-600",
                      ""
                    ),
                    conditionClass(!trace.code, "pointer-events-none")
                  )}
                >
                  <Typography.Text className="text-xs">{trace.absPath}</Typography.Text>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </Col>
        <Col span={24} md={16}>
          {selectedTrace?.code?.length > 0 && <CodePreview trace={selectedTrace} />}

          <Space className="w-full p-5 bg-gray-800 rounded-md" direction="vertical">
            <ColumnDetail label="Filename" value={selectedTrace?.filename} />
            <ColumnDetail label="Function" value={selectedTrace?.function} />
            <ColumnDetail label="Line No." value={selectedTrace?.lineNo} />
            <ColumnDetail label="Column No." value={selectedTrace?.columnNo} />
            <Space direction="vertical" className="w-full py-1">
              <Typography className="text-primary info-label">
                {"Absolute path"}
              </Typography>

              <Typography.Paragraph className="text-primary pr-3 font-semibold" copyable>
                {selectedTrace?.absPath}
              </Typography.Paragraph>
            </Space>
          </Space>
        </Col>
      </Row>
    </>
  );
};
