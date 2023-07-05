import { DashboardPanel, DeepPartial, METRIC_UNIT, VISUALIZATION_TYPE } from "@traceo/types";
import { Input, InputArea, Select } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { PanelEditOption, visualizationOptions, unitOptions } from "../utils";

type EditMetricType = {
  options: DeepPartial<DashboardPanel>;
  setOptions: (
    arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
  ) => void;
};
export const editPanelBasicForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

  const isHistogram = props.options.config.visualization === VISUALIZATION_TYPE.HISTOGRAM;

  forms.push({
    label: "Name",
    component: (
      <Input
        onChange={(e) => {
          setOptions((opt) => {
            opt.title = e.target["value"];
          });
        }}
        defaultValue={options.title}
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
    label: "Visualization",
    component: (
      <Select
        options={visualizationOptions}
        defaultValue={options.config.visualization}
        onChange={(event) => {
          setOptions((opt) => {
            opt.config.visualization = event?.value;

            if (event?.value === VISUALIZATION_TYPE.HISTOGRAM) {
              opt.config.unit = METRIC_UNIT.NONE;
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
          options={unitOptions}
          defaultValue={options.config.unit}
          onChange={(a) => {
            setOptions((opt) => {
              opt.config.unit = a?.value;
            });
          }}
        />
      )
    });
  }

  return forms;
};
