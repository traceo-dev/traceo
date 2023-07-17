import { MemberRole } from "@traceo/types";
import { Row } from "@traceo/ui";
import { ToolbarButton } from "./ToolbarButton";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Permissions } from "../../../../../core/components/Permissions";

interface Props {
  onCancel: () => void;
}

export const EditDashboardToolbar = ({ onCancel = undefined }: Props) => {
  return (
    <Row gap="x-3">
      <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
        <ToolbarButton
          type="submit"
          form="edit-dashboard-form"
          name="Save"
          icon={<CheckOutlined />}
        />
      </Permissions>

      <ToolbarButton name="Cancel" icon={<CloseOutlined />} onClick={() => onCancel()} />
    </Row>
  );
};
