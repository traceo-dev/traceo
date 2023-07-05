import { Page } from "../../../core/components/Page";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../store/index";
import { StoreState } from "../../../store/types";
import { useSelector } from "react-redux";
import { loadDashboard } from "./state/actions";
import { DashboardToolbar } from "./DashboardToolbar";
import { DashboardGridLayout, GridLayout } from "./DashboardGridLayout";
import styled from "styled-components";
import api from "../../../core/lib/api";
import {
  DASHBOARD_PANEL_TYPE,
  DashboardPanel,
  TimeRange,
  VISUALIZATION_TYPE
} from "@traceo/types";
import { PlotPanel } from "./panels/PlotPanel";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import dayjs from "dayjs";
import { PageCenter } from "../../../core/components/PageCenter";
import { Button, Col, Typography } from "@traceo/ui";
import { PlusOutlined } from "@ant-design/icons";
import { notify } from "../../../core/utils/notify";
import { SelectPanelModal } from "./components/SelectPanelModal";

const GridPanelItem = styled.div`
  position: relative;
  touch-action: manipulation;
`;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id, did } = useParams();
  const [itemDimensions, setItemDimensions] = useState({});
  const [isRemoveMode, setRemoveMode] = useState<boolean>(false);

  const { dashboard } = useSelector((state: StoreState) => state.dashboard);

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(1, "h").unix(),
    to: dayjs().unix()
  });

  useEffect(() => {
    fetchDashboardPanels();
  }, [did]);

  const fetchDashboardPanels = () => dispatch(loadDashboard(did));

  const generateLayout = () => {
    if (!dashboard || dashboard.panels?.length === 0) {
      return [];
    }

    return dashboard.panels?.map((panel) => ({
      i: panel.id,
      x: panel.gridPosition.x,
      y: panel.gridPosition.y,
      w: panel.gridPosition.w,
      h: panel.gridPosition.h
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
        positions
      })
      .catch(() => {
        notify.error("The dashboard layout cannot be changed. Please try again later!");
      });
  };

  const onChangeTimeRange = (range: TimeRange) => {
    setRanges(range);
  };

  const onRemovePanel = () => {
    fetchDashboardPanels();
  };

  const renderPanel = (panel: DashboardPanel) => {
    const props = {
      isEditable: dashboard.isEditable,
      isRemoveMode,
      dimensions: itemDimensions[panel.id],
      panel,
      ranges,
      onChangeTimeRange,
      onRemovePanel
    };

    return getVisualizationComponent(panel.type, panel.config.visualization, props);
  };

  const getVisualizationComponent = (
    type: DASHBOARD_PANEL_TYPE,
    visualization: VISUALIZATION_TYPE,
    props: any
  ) => {
    switch (type) {
      case "custom":
        const isPlotPanel = [
          VISUALIZATION_TYPE.HISTOGRAM,
          VISUALIZATION_TYPE.TIME_SERIES
        ].includes(visualization);

        if (isPlotPanel) {
          return <PlotPanel {...props} />;
        }

        return undefined;
      default:
        return undefined;
    }
  };

  const handleResize = (_layout, _oldItem, newItem) => {
    setItemDimensions({
      ...itemDimensions,
      [newItem.i]: { width: newItem.w, height: newItem.h }
    });
  };

  const [isSelectPanelModal, setSelectPanelModal] = useState<boolean>(false);
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
        isEditable={dashboard.isEditable}
      >
        {dashboard.panels?.map((panel) => (
          <GridPanelItem key={panel.id}>{renderPanel(panel)}</GridPanelItem>
        ))}
      </DashboardGridLayout>
    );
  };

  return (
    <Page>
      <Page.Content>
        <DashboardToolbar
          isRemoveMode={isRemoveMode}
          setRemoveMode={setRemoveMode}
          showTimepicker={dashboard.panels?.length !== 0}
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
