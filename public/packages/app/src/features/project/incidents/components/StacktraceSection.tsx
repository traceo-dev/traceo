import { CodePreview } from "../../../../core/components/CodePreview";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  UpOutlined
} from "@ant-design/icons";
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
  Row
} from "@traceo/ui";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { isEmpty } from "@traceo/types";
import { Truncate } from "./TruncatePath";

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
  const [isToggleTraces, setToggleTraces] = useState<boolean>(false);

  const traces = incident?.traces;
  if (isEmpty(traces)) {
    return null;
  }

  const toggleTraces = () => setToggleTraces(!isToggleTraces);

  const getTraces = () => {
    if (!isToggleTraces) {
      const removeCount = 15 - traces.length;
      return traces.slice(0, removeCount);
    }

    return traces;
  };

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
        <Fragment>
          <Collapse className="my-5" defaultActiveKey={"0"}>
            {getTraces().map((trace, index) => (
              <CollapseItem
                panelKey={String(index)}
                header={
                  <div className="flex gap-x-2">
                    <Truncate maxLength={70} leftTrim value={trace.filename} />
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
                  <Row className="gap-x-2 items-center text-sm mb-9 text-link">
                    <Tooltip title="File path">
                      <FileOutlined />
                    </Tooltip>
                    <span>{trace?.absPath}</span>
                  </Row>
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
          {traces.length > 15 && (
            <div className="flex w-full justify-center text-xs">
              <Row
                onClick={() => toggleTraces()}
                gap="x-2"
                className="items-center  hover:bg-secondary cursor-pointer px-2 py-1 rounded"
              >
                <span>
                  Show {isToggleTraces ? "less" : `all ${incident?.traces.length} traces`}
                </span>
                {isToggleTraces ? <UpOutlined /> : <DownOutlined />}
              </Row>
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};
