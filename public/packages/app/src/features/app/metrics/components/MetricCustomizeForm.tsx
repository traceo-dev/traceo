import { FC, useMemo } from "react";
import { IMetric, DeepPartial, IMetricSerie } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { Card, Divider, FieldLabel } from "@traceo/ui";
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
    <div className="col-span-4 ml-1">
      <Card title="Customize graph">
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
      </Card>
      <Card title="Graph series" bodyClassName="max-h-[500px] overflow-y-auto">
        {props.options.series.map((serie, index) => (
          <div key={index}>
            <CustomizeFormSection title={serie.name}>
              <>
                {editSerieForm({
                  index,
                  serie: serie as IMetricSerie,
                  setOptions: props.setOptions,
                  isDefault: props.options.isDefault
                }).map((opt, index) => (
                  <FieldLabel
                    key={index}
                    label={opt.label}
                    labelPosition={opt?.labelPosition}
                    labelSize="xs"
                  >
                    {opt.component}
                  </FieldLabel>
                ))}
              </>
            </CustomizeFormSection>
            <Divider />
          </div>
        ))}
      </Card>
    </div>
  );
};
