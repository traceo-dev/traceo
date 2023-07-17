import { DashboardPanel, DeepPartial, METRIC_UNIT, VISUALIZATION_TYPE } from "@traceo/types";
import { Input, InputArea, Select } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { PanelEditOption, unitOptions, visualizationOptions } from "../utils";

type EditMetricType = {
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
};
export const editPanelBasicForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

  const visualization = props.options.config.visualization;
  const hasUnitField = [VISUALIZATION_TYPE.TIME_SERIES].includes(visualization);

  forms.push({
    label: "Visualization type",
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

  if (hasUnitField) {
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
