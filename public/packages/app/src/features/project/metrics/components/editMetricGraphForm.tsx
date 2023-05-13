import { IMetric } from "@traceo/types";
import { LabelPosition, RadioButtonGroup, Switch } from "@traceo/ui";
import { DeepPartial } from "redux";
import { DraftFunction } from "use-immer";

interface MetricEditOption {
  label: string;
  labelPosition?: LabelPosition;
  component: JSX.Element;
}

interface Props {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}

export const editMetricGraphForm = (props: Props) => {
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

  if (options.config.legend.show) {
    forms.push({
      label: "Legend position",
      component: (
        <RadioButtonGroup
          options={[
            {
              label: "Horizontal",
              value: "horizontal"
            },
            {
              label: "Vertical",
              value: "vertical"
            }
          ]}
          value={options.config.legend.orient}
          onChange={(e) => {
            setOptions((opt) => {
              opt.config.legend.orient = e;
            });
          }}
        />
      )
    });
  }

  // forms.push({
  //   label: "Show area",
  //   labelPosition: "horizontal",
  //   component: (
  //     <Switch
  //       value={options.config.area.show}
  //       onChange={(e) => {
  //         setOptions((opt) => {
  //           opt.config.area.show = e.target["checked"];
  //         });
  //       }}
  //     />
  //   )
  // });

  // if (options.config.area.show) {
  //   forms.push({
  //     label: "Area opacity",
  //     component: (
  //       <Input
  //         type="number"
  //         min={0}
  //         max={100}
  //         value={options.config.area.opacity}
  //         onChange={(e) => {
  //           if (e.target["value"] <= 100) {
  //             setOptions((opt) => {
  //               opt.config.area.opacity = Number(e.target["value"]);
  //             });
  //           }
  //         }}
  //       />
  //     )
  //   });
  // }

  return forms;
};
