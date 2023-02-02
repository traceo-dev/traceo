import { FC } from "react";
import { IMetric, DeepPartial, IMetricSerie } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { Card, Collapse, CollapseItem, FieldLabel } from "@traceo/ui";
import { useMemo } from "react";
import { editMetricBasicForm } from "./editMetricBasicForm";
import { editMetricGraphForm } from "./editMetricGraphForm";
import { editMetricSeriesForm, editSerieForm222 } from "./editMetricSeriesForm";

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
            </>
          </CollapseItem>
          <>
            {props.options.series.map((serie, index) => (
              <CollapseItem collapseIconPosition="start" ghost header={serie.name}>
                <>
                  {editSerieForm222({
                    index,
                    serie: serie as IMetricSerie,
                    setOptions: props.setOptions
                  }).map((opt) => (
                    <FieldLabel label={opt.label} labelPosition={opt?.labelPosition}>
                      {opt.component}
                    </FieldLabel>
                  ))}
                </>
              </CollapseItem>
            ))}
          </>
        </Collapse>
      </Card>
    </div>
  );
};
