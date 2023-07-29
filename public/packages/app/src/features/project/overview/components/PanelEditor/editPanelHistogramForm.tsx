import { DashboardPanel } from "@traceo/types";
import { Input, Switch } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { PanelEditOption } from "../utils";

interface Props {
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}

export const editPanelHistogramForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

  const config = options.config;

  forms.push({
    label: "Bucket size",
    component: (
      <Input
        type="number"
        min={1}
        value={config.histogram?.bucket?.size}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.histogram.bucket.size = Number(e.target["value"]);
          });
        }}
      />
    )
  });

  forms.push({
    label: "Inlcude zero",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={config.histogram?.min === 0}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.histogram.min = e.target["checked"] ? 0 : 1;
          });
        }}
      />
    )
  });

  return forms;
};
