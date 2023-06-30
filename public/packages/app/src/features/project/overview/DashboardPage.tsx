import { Page } from "../../../core/components/Page";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { useAppDispatch } from "../../../store/index";
import { StoreState } from "../../../store/types";
import { useSelector } from "react-redux";
import { loadDashboard } from "./state/actions";
import { DashboardToolbar } from "./DashboardToolbar";
import { DashboardGridLayout, GridLayout } from "./DashboardGridLayout";
import styled from "styled-components";
import api from "src/core/lib/api";
import { DashboardPanel } from "@traceo/types";

const Panel = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-bg-secondary);
  border-radius: 2px;
`;

export const DashboardPage = () => {
  const { did } = useParams();

  const dispatch = useAppDispatch();

  const { dashboard, isLoading: isDashboardLoading } = useSelector(
    (state: StoreState) => state.dashboard
  );

  useEffect(() => {
    dispatch(loadDashboard(did));
  }, [did]);

  if (isDashboardLoading) {
    return <TraceoLoading />;
  }

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

    await api.patch(`/api/dashboard/layout`, {
      positions
    });
  };

  const renderPanel = (panel: DashboardPanel) => {};

  return (
    <Page>
      <Page.Content>
        <DashboardToolbar />
        <DashboardGridLayout handleLayoutChange={handleLayoutChange} layout={generateLayout()}>
          {dashboard.panels?.map((panel) => (
            <Panel key={panel.id}>{renderPanel(panel)}</Panel>
          ))}
        </DashboardGridLayout>
      </Page.Content>
    </Page>
  );
};

export default DashboardPage;
