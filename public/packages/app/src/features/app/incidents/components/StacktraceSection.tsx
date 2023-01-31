import { CodePreview } from "../../../../core/components/CodePreview";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../store/types";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Typography,
  Card,
  Space,
  Tooltip,
  Collapse,
  CollapseItem,
  FieldLabel
} from "@traceo/ui";

export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const isTraces = incident?.traces?.length > 0;

  if (!isTraces) {
    return null;
  }

  return (
    <Card title="Stacktrace" className="h-auto">
      <Space className="w-full py-3 gap-0" direction="vertical">
        <Typography size="xl" weight="semibold" className="font-mono">
          {incident?.type}
        </Typography>
        <Typography className="font-mono">{incident?.message}</Typography>
      </Space>
      <Collapse className="my-5" defaultActiveKey={"0"}>
        {incident?.traces?.map((trace, index) => (
          <CollapseItem
            panelKey={`${index}`}
            header={
              <Typography>
                {trace.absPath}:{trace.lineNo}:{trace.columnNo}
              </Typography>
            }
            startIcon={
              <Tooltip
                title={
                  trace.internal
                    ? "This exception has been thrown in your code"
                    : "This exception has been thrown in third-party external library"
                }
              >
                <ExclamationCircleOutlined
                  className={joinClasses(
                    "mr-2",
                    conditionClass(trace.internal, "text-amber-500", "text-cyan-500")
                  )}
                />
              </Tooltip>
            }
            key={index}
            className={joinClasses(conditionClass(!trace.code, "pointer-events-none"))}
          >
            <>
              <div className="w-full flex flex-row justify-between p-5">
                <FieldLabel label="Function">
                  <span className="text-link">{trace?.function}</span>
                </FieldLabel>
                <FieldLabel label="Extension">
                  <span className="text-link">{trace?.extension}</span>
                </FieldLabel>
                <FieldLabel label="Line No.">
                  <span className="text-link">{trace?.lineNo}</span>
                </FieldLabel>
                <FieldLabel label="Column No.">
                  <span className="text-link">{trace?.columnNo}</span>
                </FieldLabel>
              </div>
              <CodePreview trace={trace} />
            </>
          </CollapseItem>
        ))}
      </Collapse>
    </Card>
  );
};
