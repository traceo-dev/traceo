import { QuestionCircleFilled } from "@ant-design/icons";
import { DashboardPanel } from "@traceo/types";
import { InputArea, Row } from "@traceo/ui";
import { OptionsCollapseGroup } from "src/features/project/explore/components/OptionsCollapseGroup";
import { DraftFunction } from "use-immer";

interface Props {
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}
export const TextEditor = ({ options, setOptions }: Props) => {
  return (
    <OptionsCollapseGroup title="Text editor" deafultCollapsed={false}>
      <InputArea
        rows={25}
        defaultValue={options.config.text.value}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.text.value = e.target["value"];
          });
        }}
      />
      <Row className="text-xs text-secondary gap-x-2 pt-5">
        <QuestionCircleFilled />
        <span>Markdown and HTML supported.</span>
      </Row>
    </OptionsCollapseGroup>
  );
};
