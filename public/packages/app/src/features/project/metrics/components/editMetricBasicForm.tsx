import { DeepPartial, IMetric, METRIC_UNIT, MetricType, PLOT_TYPE } from "@traceo/types";
import { Input, InputArea, Select } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { MetricEditOption, metricTypeOptions, unitOptions } from "./utils";

type EditMetricType = {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
};
export const editMetricBasicForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  const isHistogram = props.options.type === MetricType.HISTOGRAM;

  forms.push({
    label: "Name",
    component: (
      <Input
        onChange={(e) => {
          setOptions((opt) => {
            opt.name = e.target["value"];
          });
        }}
        defaultValue={options.name}
        maxLength={40}
      />
    )
  });

  forms.push({
    label: "Description",
    component: (
      <InputArea
        onChange={(e) => {
          setOptions((opt) => {
            opt.description = e.target["value"];
          });
        }}
        defaultValue={options.description}
        maxLength={1000}
      />
    )
  });

  forms.push({
    label: "Type",
    component: (
      <Select
        isDisabled={options?.internal}
        options={metricTypeOptions}
        defaultValue={options.type}
        onChange={(a) => {
          setOptions((opt) => {
            opt.type = a?.value;

            if (a?.value === MetricType.HISTOGRAM) {
              opt.unit = METRIC_UNIT.NONE;
              opt.config.tooltip.show = false;
            }
          });
        }}
      />
    )
  });

  if (!isHistogram) {
    forms.push({
      label: "Unit",
      tooltip: "Base unit for Y axis.",
      component: (
        <Select
          isDisabled={options?.internal || isHistogram}
          options={unitOptions}
          defaultValue={options.unit}
          onChange={(a) => {
            setOptions((opt) => {
              opt.unit = a?.value;
            });
          }}
        />
      )
    });
  }

  return forms;
};
