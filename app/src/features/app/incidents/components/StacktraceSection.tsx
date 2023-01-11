import { Tooltip } from "antd";
import { CodePreview } from "../../../../core/components/CodePreview";
import { ColumnDetail } from "../../../../core/components/ColumnDetail";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { Collapse } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Typography } from "core/ui-components/Typography/Typography";
import { Card } from "core/ui-components/Card/Card";
import { Space } from "core/ui-components/Space/Space";

const { Panel } = Collapse;

export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const isTraces = incident?.traces?.length > 0;

  if (!isTraces) {
    return null;
  }

  return (
    <>
      <Card title="Stacktrace">
        <Space className="w-full py-5 gap-0" direction="vertical">
          <Typography size="xl" weight="semibold">
            {incident?.type}
          </Typography>
          <Typography>{incident?.message}</Typography>
        </Space>
        <Collapse
          expandIconPosition="end"
          defaultActiveKey={["0"]}
          ghost
          className="my-12"
        >
          {incident?.traces?.map((trace, index) => (
            <Panel
              header={
                <Space className="w-full">
                  <Tooltip
                    title={
                      trace.internal
                        ? "This exception has been thrown in your code"
                        : "This exception has been thrown in third-party external library"
                    }
                  >
                    <ExclamationCircleOutlined
                      className={conditionClass(
                        trace.internal,
                        "text-amber-500",
                        "text-cyan-500"
                      )}
                    />
                  </Tooltip>

                  <Typography>
                    {trace.absPath}:{trace.lineNo}:{trace.columnNo}
                  </Typography>
                </Space>
              }
              key={index}
              className={joinClasses(conditionClass(!trace.code, "pointer-events-none"))}
            >
              <Space className="w-full p-5">
                <ColumnDetail label="Function" value={trace?.function} />
                <ColumnDetail label="Line No." value={trace?.lineNo} />
                <ColumnDetail label="Column No." value={trace?.columnNo} />
              </Space>
              <CodePreview trace={trace} />
            </Panel>
          ))}
        </Collapse>
      </Card>
      <style>{`
          .ant-collapse-header {
            border: 1px solid #2a2d32;
            border-radius: 4px;
            background-color: var(--color-bg-secondary);
            margin-bottom: 5px;
          }

          .ant-collapse-content-box {
            border: 1px solid #2a2d32;
            border-radius: 4px;
          }
        `}</style>
    </>
  );
};
