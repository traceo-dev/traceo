import { DeepPartial, IMetric, METRIC_UNIT } from "@traceo/types";
import { Input, InputArea, LabelPosition, Select } from "@traceo/ui";
import { DraftFunction } from "use-immer";

const unitOptions = Object.values(METRIC_UNIT).map((unit) => ({
  value: unit,
  label: unit
}));

interface MetricEditOption {
  label: string;
  labelPosition?: LabelPosition;
  component: JSX.Element;
}

type EditMetricType = {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
};
export const editMetricBasicForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  /**
   * TODO: add additional logic here based on plot type, user preferences etc.
   */
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

  // forms.push({
  //   label: "Show description",
  //   labelPosition: "vertical",
  //   component: (
  //     <Switch
  //       value={options.showDescription}
  //       onChange={(e) => {
  //         setOptions((opt) => {
  //           opt.showDescription = e.target["checked"];
  //         });
  //       }}
  //     />
  //   )
  // });
  return forms;
};
