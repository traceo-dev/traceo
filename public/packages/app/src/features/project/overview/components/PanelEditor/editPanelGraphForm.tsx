import { DashboardPanel } from "@traceo/types";
import { Switch } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { PanelEditOption, isStackAvailable } from "../utils";

interface Props {
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}

export const editPanelStackForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

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

  return forms;
};

export const editPanelMarkerForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

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

  return forms;
};

export const editPanelTooltipForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

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

export const editPanelLegendForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

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

  return forms;
};
export const editPanelAxisForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

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
    label: "Show float labels",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={options.config?.axis?.showFloatLabels}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.axis.showFloatLabels = e.target["checked"];
          });
        }}
      />
    )
  });

  return forms;
};
