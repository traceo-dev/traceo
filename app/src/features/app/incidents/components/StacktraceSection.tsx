import { Space, Tooltip, Typography } from "antd";
import { CodePreview } from "../../../../core/components/CodePreview";
import { ColumnDetail } from "../../../../core/components/ColumnDetail";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { useSelector } from "react-redux";
import { PagePanel } from "../../../../core/components/PagePanel";
import { StoreState } from "../../../../types/store";
import { Collapse } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const isTraces = incident?.traces?.length > 0;

  if (!isTraces) {
    return null;
  }

  return (
    <>
      <PagePanel title="Stacktrace">
        <Space className="w-full py-5 gap-0" direction="vertical">
          <Typography.Text className="text-xl font-semibold">
            {incident?.type}
          </Typography.Text>
          <Typography.Text className="text-md">{incident?.message}</Typography.Text>
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

                  <Typography.Text className="text-md">
                    {trace.absPath}:{trace.lineNo}:{trace.columnNo}
                  </Typography.Text>
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
      </PagePanel>
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
