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
import { useDashboard } from "../../../core/hooks/useDashboard";
import {
  GRID_MIN_HEIGHT,
  GRID_MIN_WIDTH,
  calculatePlotHeight,
  getVisualizationComponent
} from "./utils";
import { PanelProps } from "./components/Panels/types";
import { useProject } from "src/core/hooks/useProject";
import { useParams } from "react-router-dom";

const GridPanelItem = styled.div`
  position: relative;
  touch-action: manipulation;
`;

export const DashboardPage = () => {
  const { id } = useParams();
  const dashboard = useDashboard();
  const { permission } = useProject();
  const [itemDimensions, setItemDimensions] = useState({});
  const [isRemoveMode, setRemoveMode] = useState<boolean>(false);
  const [isSelectPanelModal, setSelectPanelModal] = useState<boolean>(false);

  const showTimepicker = dashboard.panels?.length !== 0 && dashboard.isTimePicker;
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

    return dashboard.panels?.map((panel) => ({
      i: panel.id,
      x: panel.gridPosition.x,
      y: panel.gridPosition.y,
      w: panel.gridPosition.w,
      h: panel.gridPosition.h,
      minW: GRID_MIN_WIDTH,
      minH: GRID_MIN_HEIGHT
    }));
  };

  const handleLayoutChange = async (layouts: GridLayout[]) => {
    const positions = layouts.map((layout) => ({
      x: layout.x,
      y: layout.y,
      h: layout.h,
      w: layout.w,
      i: layout.i
    }));

    await api
      .patch(`/api/dashboard/layout`, {
        positions,
        projectId: id,
        dashboardId: dashboard.id
      })
      .catch(() => {
        notify.error("The dashboard layout cannot be changed. Please try again later!");
      });
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
      <Page.Content>
        <DashboardToolbar
          dashboard={dashboard}
          isRemoveMode={isRemoveMode}
          setRemoveMode={setRemoveMode}
          showTimepicker={showTimepicker}
          ranges={ranges}
          onChangeRanges={setRanges}
        />
        {renderContent()}
      </Page.Content>
      <SelectPanelModal isOpen={isSelectPanelModal} onCancel={() => setSelectPanelModal(false)} />
    </Page>
  );
};

export default DashboardPage;
