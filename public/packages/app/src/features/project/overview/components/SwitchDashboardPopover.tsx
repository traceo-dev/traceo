import {
  AppstoreFilled,
  DeleteOutlined,
  DownOutlined,
  LoadingOutlined,
  LockOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
  SwitcherOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import { StoreState } from "@store/types";
import { Dashboard, MemberRole, Setter } from "@traceo/types";
import { Popover, Row, Select, Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import { useState } from "react";
import { Permissions } from "src/core/components/Permissions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PopoverSelectOptions } from "src/core/components/PopoverSelectOptions";
import { useProject } from "src/core/hooks/useProject";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import api from "src/core/lib/api";
import { useAppDispatch } from "../../../../store/index";
import { loadDashboard } from "../state/actions";
import { notify } from "src/core/utils/notify";
import { TRY_AGAIN_LATER_ERROR } from "src/core/utils/constants";

interface Props {
  isRemoveMode: boolean;
  setRemoveMode: Setter<boolean>;
}
export const SwitchDashboardPopover = ({ isRemoveMode, setRemoveMode }: Props) => {
  const { project } = useProject();
  const navigate = useNavigate();

  const { dashboard } = useSelector((state: StoreState) => state.dashboard);
  const hasPanels = dashboard && dashboard.panels?.length > 0;

  const dispatch = useAppDispatch();

  const { data: dashboards = [], isLoading } = useReactQuery<Dashboard[]>({
    queryKey: [`dashboards_${project.id}`],
    url: `/api/dashboard/project/${project.id}`
  });

  const onSelectDashboard = (id: string) => {
    navigate(`/project/${project.id}/dashboard/${id}`);
  };

  const renderPopoverContent = () => {
    if (isLoading) {
      return <LoadingOutlined />;
    }

    const options = dashboards.map((dashboard) => ({
      label: dashboard.name,
      icon: <AppstoreFilled />,
      onClick: () => onSelectDashboard(dashboard.id)
    }));

    return <PopoverSelectOptions title="Select dashboard" options={options} />;
  };

  const onEditDashboard = () => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${dashboard.id}/edit`
    });
  };

  const onAddPanel = () => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${dashboard.id}/panel-create`
    });
  };

  const onLockDashboard = async () => {
    await api
      .patch("/api/dashboard", {
        ...dashboard,
        dashboardId: dashboard.id,
        projectId: project.id,
        isEditable: !dashboard.isEditable
      })
      .then(() => {
        dispatch(loadDashboard(dashboard.id));
        notify.success(`Dashbord ${!dashboard.isEditable ? "locked" : "unlocked"}.`);
      })
      .catch(() => notify.error(TRY_AGAIN_LATER_ERROR));
  };

  const onRemovePanel = () => setRemoveMode(!isRemoveMode);

  return (
    <Row className="gap-x-5 w-full">
      <div className="gap-x-2 text-sm flex flex-row items-center select-none">
        <AppstoreFilled className="text-sm" />
        <span>Dashboard</span>
        <RightOutlined className="text-[9px]" />
        <span>{dashboard.name}</span>
      </div>

      <Row className="text-xs gap-x-9 pl-5">
        <Popover
          placement="bottom"
          overrideStyles={{ marginTop: "15px" }}
          showArrow={false}
          content={renderPopoverContent()}
        >
          <SwitcherOutlined className="cursor-pointer" />
        </Popover>

        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          <Tooltip title="Add new panel">
            <PlusCircleOutlined onClick={() => onAddPanel()} className="cursor-pointer" />
          </Tooltip>
          <Tooltip title="Settings">
            <SettingOutlined onClick={() => onEditDashboard()} className="cursor-pointer" />
          </Tooltip>
          {hasPanels && (
            <>
              <Tooltip title={dashboard.isEditable ? "Lock dashboard" : "Unlock dashboard"}>
                <div onClick={() => onLockDashboard()} className="cursor-pointer">
                  {dashboard.isEditable ? (
                    <LockOutlined />
                  ) : (
                    <UnlockOutlined className="text-yellow-600" />
                  )}
                </div>
              </Tooltip>
              <Tooltip title="Remove panels">
                <DeleteOutlined
                  onClick={() => onRemovePanel()}
                  className={joinClasses(
                    "cursor-pointer",
                    conditionClass(isRemoveMode, "text-yellow-600")
                  )}
                />
              </Tooltip>
            </>
          )}
        </Permissions>
      </Row>
    </Row>
  );
};
