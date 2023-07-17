import { Dashboard, MemberRole, Setter, TimeRange } from "@traceo/types";
import { Row } from "@traceo/ui";
import { PlusOutlined, SettingOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../../store/index";
import { Fragment, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../../../core/utils/constants";
import { loadDashboard } from "../../state/actions";
import { Permissions } from "../../../../../core/components/Permissions";
import { notify } from "../../../../../core/utils/notify";
import { SelectPanelModal } from "../SelectPanelModal";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarTimePicker } from "../../../../../core/components/ToolbarTimePicker";

interface Props {
  showTimepicker?: boolean;
  ranges: TimeRange;
  onChangeRanges: Setter<TimeRange>;
  setRemoveMode: Setter<boolean>;
  dashboard: Dashboard;
}
export const DashboardToolbar = ({
  showTimepicker = true,
  ranges = [undefined, undefined],
  onChangeRanges = undefined,
  setRemoveMode = undefined,
  dashboard = undefined
}: Props) => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const hasPanels = dashboard && dashboard.panels?.length > 0;
  const isBaseDashboard = dashboard.isBase;

  const [isSelectPanelModal, setSelectPanelModal] = useState<boolean>(false);

  const onEditDashboard = () => {
    navigate({
      pathname: `/project/${id}/dashboard/${dashboard.id}/edit`
    });
  };

  const onAddPanel = () => {
    setSelectPanelModal(true);
  };

  const onLockDashboard = async () => {
    const lockState = !dashboard.isEditable;
    if (!lockState) {
      setRemoveMode(false);
    }

    await api
      .patch("/api/dashboard", {
        ...dashboard,
        dashboardId: dashboard.id,
        projectId: id,
        isEditable: lockState
      })
      .then(() => {
        dispatch(loadDashboard(dashboard.id));
        notify.success(`Dashbord ${lockState ? "locked" : "unlocked"}.`);
      })
      .catch(() => notify.error(TRY_AGAIN_LATER_ERROR));
  };

  return (
    <Fragment>
      <Row gap="x-2" className="justify-end">
        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          {!isBaseDashboard && (
            <ToolbarButton
              name="Add panel"
              icon={<PlusOutlined />}
              onClick={() => onAddPanel()}
            />
          )}

          <ToolbarButton
            name="Settings"
            icon={<SettingOutlined />}
            onClick={() => onEditDashboard()}
          />

          {hasPanels && !isBaseDashboard && (
            <ToolbarButton
              name={dashboard.isEditable ? "Lock dashboard" : "Unlock dashboard"}
              icon={<LockOutlined />}
              onClick={() => onLockDashboard()}
            />
          )}
        </Permissions>

        {showTimepicker && <ToolbarTimePicker ranges={ranges} onChangeRanges={onChangeRanges} />}
      </Row>
      <SelectPanelModal isOpen={isSelectPanelModal} onCancel={() => setSelectPanelModal(false)} />
    </Fragment>
  );
};
