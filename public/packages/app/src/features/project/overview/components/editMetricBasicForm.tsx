import { DashboardPanel, DeepPartial, METRIC_UNIT, MetricType, PANEL_TYPE } from "@traceo/types";
import { Input, InputArea, Select } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { MetricEditOption, panelTypeOptions, unitOptions } from "./utils";

type EditMetricType = {
  options: DeepPartial<DashboardPanel>;
  setOptions: (
    arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
  ) => void;
};
export const editMetricBasicForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  const isHistogram = props.options.type === PANEL_TYPE.HISTOGRAM;

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
    label: "Type",
    component: (
      <Select
        options={panelTypeOptions}
        defaultValue={options.type}
        onChange={(a) => {
          setOptions((opt) => {
            opt.type = a?.value;

            if (a?.value === MetricType.HISTOGRAM) {
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
