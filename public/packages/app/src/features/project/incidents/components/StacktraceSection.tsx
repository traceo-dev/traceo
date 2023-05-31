import { CodePreview } from "../../../../core/components/CodePreview";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import {
  Card,
  Tooltip,
  Collapse,
  CollapseItem,
  FieldLabel,
  RadioButtonGroup,
  Space,
  Typography,
  Alert
} from "@traceo/ui";
import { useSelector } from "react-redux";
import { useState } from "react";

type StackTraceType = "traces" | "raw";

const stacktraceTypeOptions = [
  {
    label: "Traces",
    value: "traces"
  },
  {
    label: "Raw",
    value: "raw"
  }
];
export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const [type, setType] = useState<StackTraceType>("traces");

  const isTraces = incident?.traces?.length > 0;

  if (!isTraces) {
    return null;
  }

  return (
    <Card title="Stack Trace" className="h-auto">
      <Alert
        title={<span className="text-white">{incident.name}</span>}
        message={incident.message}
        type="error"
      />
      <div className="w-full py-9">
        <RadioButtonGroup
          className="float-right"
          options={stacktraceTypeOptions}
          onChange={(type) => setType(type)}
          value={type}
        />
      </div>

      {type === "raw" && (
        <Space className="code-container whitespace-pre pl-5 whitespace-pre-wrap w-full my-5">
          <Typography className="text-white" size="xs">
            {incident?.stack}
          </Typography>
        </Space>
      )}

      {type === "traces" && (
        <Collapse className="my-5" defaultActiveKey={"0"}>
          {incident?.traces?.map((trace, index) => (
            <CollapseItem
              panelKey={`${index}`}
              header={
                <span>
                  {trace.filename} {trace.lineNo}:{trace.columnNo}
                </span>
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
            >
              <div>
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
                {trace.code && <CodePreview trace={trace} />}
              </div>
            </CollapseItem>
          ))}
        </Collapse>
      )}
    </Card>
  );
};
