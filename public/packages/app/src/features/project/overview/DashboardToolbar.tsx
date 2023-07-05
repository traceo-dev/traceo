import { DASHBOARD_PANEL_TYPE, Dashboard, MemberRole, Setter, TimeRange } from "@traceo/types";
import { Popover, Row, TimeRangePicker, Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import dayjs from "dayjs";
import { relativeTimeOptions } from "../explore/components/utils";
import {
  LoadingOutlined,
  AppstoreFilled,
  CaretDownOutlined,
  DeleteOutlined,
  LockOutlined,
  PlusCircleOutlined,
  RightOutlined,
  SettingOutlined,
  UnlockOutlined,
  DeleteFilled
} from "@ant-design/icons";
import { useAppDispatch } from "../../../store/index";
import { StoreState } from "../../../store/types";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PopoverSelectOptions } from "../../../core/components/PopoverSelectOptions";
import { useProject } from "../../../core/hooks/useProject";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import api from "../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../core/utils/constants";
import { loadDashboard } from "./state/actions";
import { Permissions } from "../../../core/components/Permissions";
import { notify } from "../../../core/utils/notify";
import { SelectPanelModal } from "./components/SelectPanelModal";

const MAX_DATE = new Date(dayjs().unix() * 1e3);

interface Props {
  showTimepicker?: boolean;
  ranges: TimeRange;
  onChangeRanges: Setter<TimeRange>;
  isRemoveMode: boolean;
  setRemoveMode: Setter<boolean>;
}
export const DashboardToolbar = ({
  showTimepicker = true,
  ranges = [undefined, undefined],
  onChangeRanges = undefined,
  isRemoveMode = false,
  setRemoveMode = undefined
}: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { project } = useProject();
  const { dashboard } = useSelector((state: StoreState) => state.dashboard);

  const hasPanels = dashboard && dashboard.panels?.length > 0;

  const [isHover, setHover] = useState<boolean>(false);
  const [isSelectPanelModal, setSelectPanelModal] = useState<boolean>(false);

  const { data: dashboards = [], isLoading } = useReactQuery<Dashboard[]>({
    queryKey: [`dashboards_${project.id}`],
    url: `/api/dashboard/project/${project.id}`
  });

  const onSelectDashboard = (id: string) => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${id}`
    });
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
        projectId: project.id,
        isEditable: lockState
      })
      .then(() => {
        dispatch(loadDashboard(dashboard.id));
        notify.success(`Dashbord ${lockState ? "locked" : "unlocked"}.`);
      })
      .catch(() => notify.error(TRY_AGAIN_LATER_ERROR));
  };

  const onRemovePanel = () => setRemoveMode(!isRemoveMode);

  return (
    <Fragment>
      <Row className="justify-between mb-2">
        <Row
          className="gap-x-5 w-full"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="gap-x-2 text-sm flex flex-row items-center select-none">
            <AppstoreFilled className="text-sm" />
            <span>Dashboard</span>
            <RightOutlined className="text-[9px]" />
            <Popover
              placement="bottom"
              overrideStyles={{ marginTop: "15px" }}
              showArrow={false}
              content={renderPopoverContent()}
            >
              <div className="flex flex-row items-center gap-x-2 cursor-pointer">
                <span>{dashboard.name}</span>
                <CaretDownOutlined />
              </div>
            </Popover>
          </div>

          <Row
            className={joinClasses("text-xs gap-x-9 pl-5", conditionClass(!isHover, "hidden"))}
          >
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <Tooltip title="Add new panel">
                <PlusCircleOutlined onClick={() => onAddPanel()} className="cursor-pointer" />
              </Tooltip>
              <Tooltip title="Settings">
                <SettingOutlined onClick={() => onEditDashboard()} className="cursor-pointer" />
              </Tooltip>
              {hasPanels && (
                <Fragment>
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
                    <div onClick={() => onRemovePanel()} className="cursor-pointer">
                      {isRemoveMode ? (
                        <DeleteFilled className="text-yellow-600" />
                      ) : (
                        <DeleteOutlined />
                      )}
                    </div>
                  </Tooltip>
                </Fragment>
              )}
            </Permissions>
          </Row>
        </Row>
        {showTimepicker && (
          <TimeRangePicker
            value={ranges}
            options={relativeTimeOptions}
            submit={(val: TimeRange) => onChangeRanges(val)}
            datesRange={true}
            maxDate={MAX_DATE}
            type="secondary"
          />
        )}
      </Row>
      <SelectPanelModal isOpen={isSelectPanelModal} onCancel={() => setSelectPanelModal(false)} />
    </Fragment>
  );
};
