import { FC } from "react";
import { IMetric, DeepPartial, IMetricSerie } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { Card, FieldLabel } from "@traceo/ui";
import { useMemo } from "react";
import { editMetricBasicForm } from "./editMetricBasicForm";
import { editMetricGraphForm } from "./editMetricGraphForm";
import { editSerieForm } from "./editMetricSeriesForm";
import { CustomizeFormSection } from "./CustomizeFormSection";

interface Props {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricCustomizeForm: FC<Props> = (props: Props) => {
  const [basicOptions, graphOptions] = useMemo(
    () => [editMetricBasicForm(props), editMetricGraphForm(props)],
    [props.options]
  );

  return (
    <div className="col-span-3 ml-1">
      <Card title="Customize graph" bodyClassName="max-h-screen overflow-y-auto">
        <CustomizeFormSection title="Basic options" defaultCollapsed={false}>
          {basicOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>
        <CustomizeFormSection title="Graph options">
          {graphOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>
        {props.options.series.map((serie, index) => (
          <CustomizeFormSection title={serie.name}>
            <>
              {editSerieForm({
                index,
                serie: serie as IMetricSerie,
                setOptions: props.setOptions
              }).map((opt) => (
                <FieldLabel
                  label={opt.label}
                  labelPosition={opt?.labelPosition}
                  labelSize="xs"
                >
                  {opt.component}
                </FieldLabel>
              ))}
            </>
          </CustomizeFormSection>
        ))}
      </Card>
    </div>
  );
};
