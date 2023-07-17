import { Dashboard, MemberRole, Setter, TimeRange } from "@traceo/types";
import { Row } from "@traceo/ui";
import { ToolbarButton } from "./ToolbarButton";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { RemovePanelConfirm } from "../RemovePanelConfirm";
import { useParams } from "react-router-dom";
import { Permissions } from "../../../../../core/components/Permissions";
import { ToolbarTimePicker } from "../../../../../core/components/ToolbarTimePicker";

interface Props {
  isTimePicker: boolean;
  isCustomPanel: boolean;
  isCustomizeMode: boolean;
  ranges: TimeRange;
  setRanges: Setter<TimeRange>;
  dashboard: Dashboard;
  setCustomizeMode: Setter<boolean>;
  onDiscard: () => void;
  onSave: () => void;
}

export const PanelToolbar = ({
  isTimePicker = false,
  isCustomPanel = false,
  isCustomizeMode = false,
  ranges = [undefined, undefined],
  setRanges = undefined,
  dashboard = undefined,
  setCustomizeMode = undefined,
  onSave = undefined,
  onDiscard = undefined
}: Props) => {
  const { panelId } = useParams();

  return (
    <Row gap="x-3">
      {isCustomPanel && !isCustomizeMode && (
        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          <ToolbarButton
            name="Edit"
            icon={<EditOutlined />}
            onClick={() => setCustomizeMode(true)}
          />
        </Permissions>
      )}

      {!dashboard.isBase && !isCustomizeMode && (
        <RemovePanelConfirm panelId={panelId}>
          <ToolbarButton name="Remove" icon={<CloseOutlined />} />
        </RemovePanelConfirm>
      )}

      {isCustomizeMode && (
        <ToolbarButton name="Save changes" icon={<CheckOutlined />} onClick={() => onSave()} />
      )}

      {isCustomizeMode && (
        <ToolbarButton name="Discard" icon={<CloseOutlined />} onClick={() => onDiscard()} />
      )}

      {isTimePicker && <ToolbarTimePicker ranges={ranges} onChangeRanges={setRanges} />}
    </Row>
  );
};
