import { Dashboard, MemberRole, Setter, TimeRange } from "@traceo/types";
import { Row, TimeRangePicker } from "@traceo/ui";
import dayjs from "dayjs";
import { relativeTimeOptions } from "../../../explore/components/utils";
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
import styled from "styled-components";

const ToolbarButton = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-inline: 9px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 4px;
  cursor: pointer;
  gap: 6px;
  font-weight: 500;
  font-size: 12px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;

const MAX_DATE = new Date(dayjs().unix() * 1e3);

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
            <ToolbarButton onClick={() => onAddPanel()}>
              <PlusOutlined />
              Add panel
            </ToolbarButton>
          )}

          <ToolbarButton onClick={() => onEditDashboard()}>
            <SettingOutlined />
            Settings
          </ToolbarButton>

          {hasPanels && !isBaseDashboard && (
            <ToolbarButton onClick={() => onLockDashboard()}>
              <LockOutlined />
              {dashboard.isEditable ? "Lock dashboard" : "Unlock dashboard"}
            </ToolbarButton>
          )}
        </Permissions>

        {showTimepicker && (
          <TimeRangePicker
            value={ranges}
            options={relativeTimeOptions}
            submit={(val: TimeRange) => onChangeRanges(val)}
            datesRange={true}
            maxDate={MAX_DATE}
            type="secondary"
            // TODO: temporary solution, create dedicated time range picker input for dashboards
            className="border-none text-xs font-semibold hover:ring-0 hover:ring-transparent hover:text-white hover:bg-secondary"
          />
        )}
      </Row>
      <SelectPanelModal isOpen={isSelectPanelModal} onCancel={() => setSelectPanelModal(false)} />
    </Fragment>
  );
};
