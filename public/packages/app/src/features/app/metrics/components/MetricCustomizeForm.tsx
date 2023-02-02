import { FC } from "react";
import { IMetric, DeepPartial } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { Card, Collapse, CollapseItem, FieldLabel } from "@traceo/ui";
import { useMemo } from "react";
import { editMetricBasicForm } from "./editMetricBasicForm";
import { editMetricGraphForm } from "./editMetricGraphForm";
import { editMetricSeriesForm } from "./editMetricSeriesForm";

interface Props {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricCustomizeForm: FC<Props> = (props: Props) => {
  const [basicOptions, graphOptions, serieOptions] = useMemo(
    () => [
      editMetricBasicForm(props),
      editMetricGraphForm(props),
      editMetricSeriesForm(props)
    ],
    [props.options]
  );

  return (
    <div className="col-span-3 ml-1">
      <Card title="Customize metric" bodyClassName="max-h-screen overflow-y-auto">
        <Collapse ghost collapseIconPosition="start" defaultActiveKey="basic">
          <CollapseItem className="pl-0" header="Basic options" panelKey="basic">
            <>
              {basicOptions.map((opt, index) => (
                <FieldLabel
                  key={index}
                  label={opt.label}
                  labelPosition={opt?.labelPosition}
                >
                  {opt.component}
                </FieldLabel>
              ))}
            </>
          </CollapseItem>
          <CollapseItem className="pl-0" header="Graph options" key={"graph"}>
            <>
              {graphOptions.map((opt, index) => (
                <FieldLabel
                  key={index}
                  label={opt.label}
                  labelPosition={opt?.labelPosition}
                >
                  {opt.component}
                </FieldLabel>
              ))}
              {/* <FieldLabel label="Line width">
                <Slider
                  marks={{
                    1: 1,
                    10: 10
                  }}
                  min={1}
                  max={10}
                  onChange={(v) => onChangeLineWidth(v)}
                />
              </FieldLabel> */}

              {/* {isArea && (
                <FieldLabel label="Area opacity">
                  <Slider
                    tooltip={{
                      formatter: (val: number) => val / 100
                    }}
                    marks={{
                      0: 0,
                      100: 1
                    }}
                    min={0}
                    max={100}
                    onChange={(v) => onChangeAreaOpacity(v)}
                  />
                </FieldLabel>
              )} */}
            </>
          </CollapseItem>
          <CollapseItem className="pl-0" header="Series options" key={"series"}>
            <>{serieOptions.map((opt) => opt.component)}</>
          </CollapseItem>
        </Collapse>
      </Card>
    </div>
  );
};
