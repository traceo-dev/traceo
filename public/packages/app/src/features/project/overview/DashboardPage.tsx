import { Page } from "../../../core/components/Page";
import { useState } from "react";
import { DashboardToolbar } from "./components/Toolbars/DashboardToolbar";
import { DashboardGridLayout, GridLayout } from "./components/DashboardGrid/DashboardGridLayout";
import styled from "styled-components";
import api from "../../../core/lib/api";
import { DashboardPanel, MemberRole, TimeRange, isEmpty } from "@traceo/types";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import dayjs from "dayjs";
import { PageCenter } from "../../../core/components/PageCenter";
import { Button, Col, Typography, conditionClass, joinClasses } from "@traceo/ui";
import { PlusOutlined } from "@ant-design/icons";
import { notify } from "../../../core/utils/notify";
import {
  GRID_MIN_HEIGHT,
  GRID_MIN_WIDTH,
  calculatePlotHeight,
  getVisualizationComponent
} from "./utils";
import { PanelProps } from "./components/Panels/types";
import { ProjectDashboardViewType } from "../../../core/types/hoc";
import withDashboard from "../../../core/hooks/withDashboard";
import { Portal } from "../../../core/components/Portal";
import { areArraysOfObjectsEqual } from "../../../core/utils/arrays";
import dateUtils from "../../../core/utils/date";
import { Permissions } from "../../../core/components/Permissions";
import { useNavigate } from "react-router-dom";

const GridPanelItem = styled.div`
  position: relative;
  touch-action: manipulation;
`;

const mapPanelGridPosition = (panels: DashboardPanel[]) => {
  return (panels ?? []).map((panel) => ({
    i: panel.id,
    x: panel.gridPosition.x,
    y: panel.gridPosition.y,
    w: panel.gridPosition.w,
    h: panel.gridPosition.h
  }));
};

const DashboardPage = ({ permission, dashboard, project }: ProjectDashboardViewType) => {
  const [itemDimensions, setItemDimensions] = useState({});
  const [isRemoveMode, setRemoveMode] = useState<boolean>(false);

  const navigate = useNavigate();

  const showTimepicker = !isEmpty(dashboard.panels) && dashboard.isTimePicker;
  const isMaintainer = [MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(permission);
  const isEditable = dashboard && dashboard.isEditable && isMaintainer;

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(1, "h").unix(),
    to: dayjs().unix()
  });

  const generateLayout = () => {
    if (isEmpty(dashboard.panels)) {
      return [];
    }

    return mapPanelGridPosition(dashboard.panels).map((panel) => ({
      ...panel,
      minW: GRID_MIN_WIDTH,
      minH: GRID_MIN_HEIGHT
    }));
  };

  const handleLayoutChange = async (layouts: GridLayout[]) => {
    if (!dashboard.id || !project.id) {
      return;
    }

    const positions = layouts.map((layout) => ({
      x: layout.x,
      y: layout.y,
      h: layout.h,
      w: layout.w,
      i: layout.i
    }));

    // Update latout position only when there are changes
    const isLayoutToUpdate = areArraysOfObjectsEqual(
      positions,
      mapPanelGridPosition(dashboard.panels)
    );
    if (!isLayoutToUpdate) {
      // TODO: send only changed positions
      await api
        .patch(`/api/dashboard/layout`, {
          positions,
          projectId: project.id,
          dashboardId: dashboard.id
        })
        .catch(() => {
          notify.error("The dashboard layout cannot be changed. Please try again later!");
        });
    }
  };

  const onChangeTimeRange = (range: TimeRange) => {
    setRanges(range);
  };

  const renderPanel = (panel: DashboardPanel) => {
    const visualization = panel.config.visualization;

    // Calculate plot height based on grid layout
    const panelHeight = itemDimensions[panel.id]?.height ?? panel.gridPosition.h;
    const plotHeight = calculatePlotHeight(panelHeight);

    const props: PanelProps = {
      isEditable,
      isRemoveMode,
      isHoverOptions: true,
      panel,
      ranges,
      height: plotHeight,
      dashboard,
      onChangeTimeRange,
      project,
      lazy: true
    };

    return getVisualizationComponent(visualization, props);
  };

  const handleResize = (_layout, _oldItem, newItem) => {
    setItemDimensions({
      ...itemDimensions,
      [newItem.i]: { width: newItem.w, height: newItem.h }
    });
  };

  const onAddPanel = () => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${dashboard.id}/panel-create`
    });
  };

  const renderContent = () => {
    if (isEmpty(dashboard.panels)) {
      return (
        <PageCenter>
          <Col className="text-center gap-y-9 leading-3">
            <Typography size="xxxl" weight="bold">
              You have no panels here...
            </Typography>
            <span className="text-secondary">
              Create new panels and add them to this dashboard to keep all your information at
              your fingertips.
            </span>
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <div className="justify-center pt-5">
                <Button onClick={() => onAddPanel()} icon={<PlusOutlined />}>
                  Add panel
                </Button>
              </div>
            </Permissions>
          </Col>
        </PageCenter>
      );
    }

    return (
      <DashboardGridLayout
        handleResize={handleResize}
        handleLayoutChange={handleLayoutChange}
        layout={generateLayout()}
        isEditable={isEditable}
      >
        {(dashboard.panels || []).map((panel) => (
          <GridPanelItem key={panel.id}>{renderPanel(panel)}</GridPanelItem>
        ))}
      </DashboardGridLayout>
    );
  };

  const hasEditPermission =
    [MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(permission) &&
    dashboard.isEditable;

  return (
    <Page title="Dashboards">
      <Portal id="dashboard-toolbar">
        <DashboardToolbar
          ranges={ranges}
          onChangeRanges={setRanges}
          setRemoveMode={setRemoveMode}
          dashboard={dashboard}
          showTimepicker={showTimepicker}
        />
      </Portal>
      <Page.Content>
        <Header dashboard={dashboard} hasEditPermission={hasEditPermission} />
        {renderContent()}
      </Page.Content>
    </Page>
  );
};

const Header = ({ dashboard, hasEditPermission }) => {
  return (
    <div className="flex flex-row justify-between pb-9">
      <div className="flex flex-col">
        <span className="text-[28px] font-semibold">{dashboard.name}</span>
        <span
          className={joinClasses(
            "text-sm",
            conditionClass(!dashboard.description, "text-secondary italic")
          )}
        >
          {dashboard.description ?? "No description provided"}
        </span>
      </div>
      <div className="text-xs text-secondary flex flex-col text-end">
        <span>{hasEditPermission ? "You can edit" : "Read-only"}</span>
        <span>Last update&nbsp;{dateUtils.fromNow(dashboard?.updatedAt)}</span>
      </div>
    </div>
  );
};

export default withDashboard(DashboardPage);
