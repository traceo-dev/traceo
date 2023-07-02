import { DashboardPanel, DeepPartial } from "@traceo/types";
import { Switch } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { MetricEditOption, isStackAvailable } from "./utils";

interface Props {
  options: DeepPartial<DashboardPanel>;
  setOptions: (
    arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
  ) => void;
}

export const editMetricStackForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  if (!isStackAvailable(props.options.config.series)) {
    setOptions((opt) => {
      opt.config.stack.show = false;
    });
  }

  forms.push({
    label: "Show stack",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config.stack?.show}
        disabled={!isStackAvailable(props.options.config.series)}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.stack.show = e.target["checked"];
          });
        }}
      />
    )
  });

  // forms.push({
  //   label: "Strategy",
  //   labelPosition: "vertical",
  //   component: (
  //     <Select
  //       isDisabled={!options.config.stack.show}
  //       options={stackStrategyOptions}
  //       defaultValue={options.config.stack?.strategy || "samesign"}
  //       onChange={(a) => {
  //         setOptions((opt) => {
  //           opt.config.stack.strategy = a?.value;
  //         });
  //       }}
  //     />
  //   )
  // });

  return forms;
};

export const editMetricMarkerForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  forms.push({
    label: "Show markers",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config.line.marker.show}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.line.marker.show = e.target["checked"];
          });
        }}
      />
    )
  });

  // forms.push({
  //   label: "Markers shape",
  //   labelPosition: "vertical",
  //   component: (
  //     <Select
  //       options={markerShapeOptions}
  //       defaultValue={options.config.line.marker.shape || "rect"}
  //       onChange={(a) => {
  //         setOptions((opt) => {
  //           opt.config.line.marker.shape = a?.value;
  //         });
  //       }}
  //     />
  //   )
  // });

  return forms;
};

export const editMetricTooltipForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  forms.push({
    label: "Show tooltip",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config.tooltip.show}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.tooltip.show = e.target["checked"];
          });
        }}
      />
    )
  });

  return forms;
};

export const editMetricLegendForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  forms.push({
    label: "Show legend",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config.legend.show}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.legend.show = e.target["checked"];
          });
        }}
      />
    )
  });

  // if (options.config.legend.show) {
  //   forms.push({
  //     label: "Legend position",
  //     component: (
  //       <RadioButtonGroup
  //         options={[
  //           {
  //             label: "Horizontal",
  //             value: "horizontal"
  //           },
  //           {
  //             label: "Vertical",
  //             value: "vertical"
  //           }
  //         ]}
  //         value={options.config.legend.orient}
  //         onChange={(e) => {
  //           setOptions((opt) => {
  //             opt.config.legend.orient = e;
  //           });
  //         }}
  //       />
  //     )
  //   });
  // }

  return forms;
};
export const editMetricAxisForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  forms.push({
    label: "Show X axis",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config?.axis?.showX}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.axis.showX = e.target["checked"];
          });
        }}
      />
    )
  });

  forms.push({
    label: "Show Y axis",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config?.axis?.showY}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.axis.showY = e.target["checked"];
          });
        }}
      />
    )
  });

  forms.push({
    label: "Show grid lines",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config?.axis?.showGridLines}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.axis.showGridLines = e.target["checked"];
          });
        }}
      />
    )
  });

  return forms;
};
