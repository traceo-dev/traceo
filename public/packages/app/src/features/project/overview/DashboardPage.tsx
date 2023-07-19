import { Page } from "../../../core/components/Page";
import { useState } from "react";
import { DashboardToolbar } from "./components/Toolbars/DashboardToolbar";
import { DashboardGridLayout, GridLayout } from "./components/DashboardGrid/DashboardGridLayout";
import styled from "styled-components";
import api from "../../../core/lib/api";
import { DashboardPanel, MemberRole, TimeRange } from "@traceo/types";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import dayjs from "dayjs";
import { PageCenter } from "../../../core/components/PageCenter";
import { Button, Col, Typography } from "@traceo/ui";
import { PlusOutlined } from "@ant-design/icons";
import { notify } from "../../../core/utils/notify";
import { SelectPanelModal } from "./components/SelectPanelModal";
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
import { areArraysEqual } from "../../../core/utils/arrays";

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
  const [isSelectPanelModal, setSelectPanelModal] = useState<boolean>(false);

  const showTimepicker = dashboard && dashboard.panels?.length !== 0 && dashboard.isTimePicker;
  const isMaintainer = [MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(permission);
  const isEditable = dashboard.isEditable && isMaintainer;

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(1, "h").unix(),
    to: dayjs().unix()
  });

  const generateLayout = () => {
    if (!dashboard || dashboard.panels?.length === 0) {
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
    const isLayoutToUpdate = areArraysEqual(positions, mapPanelGridPosition(dashboard.panels));
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
      panel,
      ranges,
      height: plotHeight,
      dashboard,
      onChangeTimeRange
    };

    return getVisualizationComponent(visualization, props);
  };

  const handleResize = (_layout, _oldItem, newItem) => {
    setItemDimensions({
      ...itemDimensions,
      [newItem.i]: { width: newItem.w, height: newItem.h }
    });
  };

  const renderContent = () => {
    if (dashboard && dashboard.panels?.length === 0) {
      return (
        <PageCenter>
          <Col className="text-center gap-y-9">
            <Typography size="xxxl" weight="bold">
              You have no panels here...
            </Typography>
            <span>
              Show everything you need in one place. Create new panels and add them to this
              dashboard to keep all your information at your fingertips.
            </span>
            <div className="justify-center">
              <Button onClick={() => setSelectPanelModal(true)} icon={<PlusOutlined />}>
                Add panel
              </Button>
            </div>
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
      <Page.Content>{renderContent()}</Page.Content>
      <SelectPanelModal isOpen={isSelectPanelModal} onCancel={() => setSelectPanelModal(false)} />
    </Page>
  );
};

export default withDashboard(DashboardPage);
