import { DashboardPanel } from "@traceo/types";
import { InputArea } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { PanelEditOption } from "../utils";

interface Props {
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}

export const editPanelTextForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: PanelEditOption[] = [];

  const config = options.config;

  forms.push({
    label: "Content",
    tooltip: "Support for markdown and HTML.",
    component: (
      <InputArea
        rows={12}
        defaultValue={config.text.value}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.text.value = e.target["value"];
          });
        }}
      />
    )
  });

  return forms;
};
