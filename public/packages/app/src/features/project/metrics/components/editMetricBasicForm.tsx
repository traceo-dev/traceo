import { DeepPartial, IMetric } from "@traceo/types";
import { Input, InputArea, Select } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { MetricEditOption, unitOptions } from "./utils";

type EditMetricType = {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
};
export const editMetricBasicForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

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
    label: "Unit",
    tooltip: "Base unit for Y axis and all series. You can also set custom unit for each serie.",
    component: (
      <Select
        isDisabled={options?.isDefault}
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

  return forms;
};
