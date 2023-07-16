import { Dashboard, MemberRole, Setter, TimeRange } from "@traceo/types";
import { Row } from "@traceo/ui";
import { ToolbarButton } from "./ToolbarButton";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { RemovePanelConfirm } from "../RemovePanelConfirm";
import { useParams } from "react-router-dom";
import { Permissions } from "../../../../../core/components/Permissions";
import { ToolbarTimePicker } from "../../../../../core/components/ToolbarTimePicker";

interface Props {
  isTimePicker: boolean;
  isCustomPanel: boolean;
  ranges: TimeRange;
  setRanges: Setter<TimeRange>;
  dashboard: Dashboard;
  setCustomizeMode: Setter<boolean>;
}

export const PanelToolbar = ({
  isTimePicker = false,
  isCustomPanel = false,
  ranges = [undefined, undefined],
  setRanges = undefined,
  dashboard = undefined,
  setCustomizeMode = undefined
}: Props) => {
  const { panelId } = useParams();

  return (
    <Row gap="x-3">
      {isCustomPanel && (
        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          <ToolbarButton
            name="Edit"
            icon={<EditOutlined />}
            onClick={() => setCustomizeMode(true)}
          />
        </Permissions>
      )}

      {!dashboard.isBase && (
        <RemovePanelConfirm panelId={panelId}>
          <ToolbarButton className="bg-error text-white" name="Remove" icon={<CloseOutlined />} />
        </RemovePanelConfirm>
      )}

      {isTimePicker && <ToolbarTimePicker ranges={ranges} onChangeRanges={setRanges} />}
    </Row>
  );
};
