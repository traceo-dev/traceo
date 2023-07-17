import { MemberRole } from "@traceo/types";
import { Row } from "@traceo/ui";
import { ToolbarButton } from "./ToolbarButton";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Permissions } from "../../../../../core/components/Permissions";

interface Props {
  onCancel: () => void;
  onSave: () => void;
}

export const CreatePanelToolbar = ({ onSave = undefined, onCancel = undefined }: Props) => {
  return (
    <Row gap="x-3">
      <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
        <ToolbarButton name="Create panel" icon={<CheckOutlined />} onClick={() => onSave()} />
      </Permissions>

      <ToolbarButton name="Cancel" icon={<CloseOutlined />} onClick={() => onCancel()} />
    </Row>
  );
};
