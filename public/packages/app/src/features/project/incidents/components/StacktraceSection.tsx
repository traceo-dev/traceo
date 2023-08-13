import { CodePreview } from "../../../../core/components/CodePreview";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { StoreState } from "../../../../store/types";
import {
  Card,
  Tooltip,
  Collapse,
  CollapseItem,
  FieldLabel,
  RadioButtonGroup,
  Space,
  Typography,
  Alert,
  Row
} from "@traceo/ui";
import { useSelector } from "react-redux";
import { useState } from "react";
import { isEmpty } from "@traceo/types";

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

  const isTraces = !isEmpty(incident?.traces);

  if (!isTraces) {
    return null;
  }

  return (
    <Card title="Stack Trace" className="h-auto">
      <div className="w-full pt-0 pb-5">
        <RadioButtonGroup
          className="float-right"
          size="sm"
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
              panelKey={String(index)}
              header={
                <div className="flex gap-x-2">
                  <span>{trace.absPath}</span>
                  <span className="text-secondary">at</span>
                  <span>{trace.function}</span>
                  <span className="text-secondary">in line</span>
                  <span>{trace.lineNo}</span>
                </div>
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
                <Row className="justify-between p-5">
                  <FieldLabel label="Function">
                    <span className="text-link text-sm">{trace?.function}</span>
                  </FieldLabel>
                  <FieldLabel label="Extension">
                    <span className="text-link text-sm">{trace?.extension}</span>
                  </FieldLabel>
                  <FieldLabel label="Line No.">
                    <span className="text-link text-sm">{trace?.lineNo}</span>
                  </FieldLabel>
                  {trace?.columnNo !== 0 && (
                    <FieldLabel label="Column No.">
                      <span className="text-link text-sm">{trace?.columnNo}</span>
                    </FieldLabel>
                  )}
                </Row>
                {trace.code && <CodePreview trace={trace} />}
              </div>
            </CollapseItem>
          ))}
        </Collapse>
      )}
    </Card>
  );
};
