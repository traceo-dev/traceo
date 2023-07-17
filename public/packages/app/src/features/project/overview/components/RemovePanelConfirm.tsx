import { ApiResponse, MemberRole } from "@traceo/types";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Confirm } from "../../../../core/components/Confirm";
import { Permissions } from "../../../../core/components/Permissions";
import api from "../../../../core/lib/api";

interface Props {
  panelId: string;
  postExecute?: () => void;
}
export const RemovePanelConfirm: FC<Props> = ({ children, panelId, postExecute }) => {
  const { id, dashboardId } = useParams();
  const navigate = useNavigate();

  const onRemove = async () => {
    await api
      .delete<ApiResponse<string>>(`/api/dashboard/panel/${panelId}`)
      .then(() => {
        navigate(`/project/${id}/dashboard/${dashboardId}`);
      })
      .finally(() => postExecute());
  };

  return (
    <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
      <Confirm
        description="Are you sure that you want to remove this panel?"
        onOk={() => onRemove()}
      >
        {children}
      </Confirm>
    </Permissions>
  );
};
