import { Dashboard, MemberRole, Setter, TimeRange, isEmpty } from "@traceo/types";
import { Row, TimeRangePicker } from "@traceo/ui";
import { PlusOutlined, SettingOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../../store/index";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../../../core/utils/constants";
import { loadDashboard } from "../../state/actions";
import { Permissions } from "../../../../../core/components/Permissions";
import { notify } from "../../../../../core/utils/notify";
import { ToolbarButton } from "./ToolbarButton";

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

  const hasPanels = !isEmpty(dashboard.panels);

  const onEditDashboard = () => {
    navigate({
      pathname: `/project/${id}/dashboard/${dashboard.id}/edit`
    });
  };

  const onAddPanel = () => {
    navigate({
      pathname: `/project/${id}/dashboard/${dashboard.id}/panel-create`
    });
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
        notify.success(`Dashbord ${lockState ? "unlocked" : "locked"}.`);
      })
      .catch(() => notify.error(TRY_AGAIN_LATER_ERROR));
  };

  return (
    <Fragment>
      <Row gap="x-2" className="justify-end">
        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          <ToolbarButton name="Add panel" icon={<PlusOutlined />} onClick={() => onAddPanel()} />

          <ToolbarButton
            name="Settings"
            icon={<SettingOutlined />}
            onClick={() => onEditDashboard()}
          />

          {hasPanels && (
            <ToolbarButton
              name={dashboard.isEditable ? "Lock dashboard" : "Unlock dashboard"}
              icon={<LockOutlined />}
              onClick={() => onLockDashboard()}
            />
          )}
        </Permissions>

        {showTimepicker && (
          <TimeRangePicker
            value={ranges}
            submit={(val: TimeRange) => onChangeRanges(val)}
            type="secondary"
          />
        )}
      </Row>
    </Fragment>
  );
};
