import { Card, Radio, Row, Space, Timeline, Typography } from "antd";
import { CodePreview } from "core/components/CodePreview";
import { ColumnDetail } from "core/components/ColumnDetail";
import { joinClasses, conditionClass } from "core/utils/classes";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Incident, Trace } from "types/incidents";
import { CollapsedDetails } from "../../../../core/components/CollapsedDetails";
import { PagePanel } from "../../../../core/components/PagePanel";
import { StoreState } from "../../../../types/store";

export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const [isInternal, setInternal] = useState<boolean>(false);
  const isTraces = incident?.traces?.length > 0;

  return (
    <>
      {isTraces && (
        <PagePanel>
          <CollapsedDetails label="Stacktrace">
            <Space className="w-full pt-8 gap-0" direction="vertical">
              <Typography.Text className="text-xl font-semibold">
                {incident?.type}
              </Typography.Text>
              <Typography.Text className="text-md">{incident?.message}</Typography.Text>
            </Space>
            <Space className="float-right pt-3">
              <Radio.Group
                className="float-right"
                value={isInternal}
                onChange={(val) => {
                  setInternal(val.target.value);
                }}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value={false}>All</Radio.Button>
                <Radio.Button value={true}>Internal</Radio.Button>
              </Radio.Group>
            </Space>
            <Space direction="vertical" className="pt-5">
              <CodeTraces incident={incident} isInternal={isInternal} />
            </Space>
          </CollapsedDetails>
        </PagePanel>
      )}
    </>
  );
};

interface CodeTracesProps {
  incident: Incident;
  isInternal: boolean;
}
const CodeTraces: FC<CodeTracesProps> = ({ incident, isInternal }) => {
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

  const Details = () => (
    <Space direction="vertical" className="w-2/3 px-5">
      {selectedTrace?.code?.length > 0 && <CodePreview trace={selectedTrace} />}

      <Space className="w-full p-5 bg-gray-800 rounded-md" direction="vertical">
        <ColumnDetail label="Filename" value={selectedTrace?.filename} />
        <ColumnDetail label="Function" value={selectedTrace?.function} />
        <ColumnDetail label="Line No." value={selectedTrace?.lineNo} />
        <ColumnDetail label="Column No." value={selectedTrace?.columnNo} />
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
                  conditionClass(!trace.code, "pointer-events-none")
                )}
              >
                <Typography.Text className="text-xs">{trace.absPath}</Typography.Text>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
        <Details />
      </Row>
    </>
  );
};
