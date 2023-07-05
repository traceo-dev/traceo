import { DashboardPanel, DeepPartial } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { PanelEditOption } from "../utils";
import { Input, Switch } from "@traceo/ui";

interface Props {
  options: DeepPartial<DashboardPanel>;
  setOptions: (
    arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
  ) => void;
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
        max={100}
        value={config.histogram?.bucket?.size}
        onChange={(e) => {
          if (e.target["value"] <= 100) {
            setOptions((opt) => {
              opt.config.histogram.bucket.size = Number(e.target["value"]);
            });
          }
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
