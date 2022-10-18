import { Space } from "antd";
import { StatCards } from "./StatCards";
import { useApi } from "../../../../core/lib/useApi";
import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { PagePanel } from "../../../../core/components/PagePanel";
import { IncidentsOverviewPlot } from "../../../../core/components/Plots/components/IncidentsOverviewPlot";
import { ApplicationStats } from "../../../../types/statistics";
import { PlotData } from "core/utils/statistics";
import { DataNotFound } from "core/components/DataNotFound";

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data: stats = [],
    isLoading,
    execute: get
  } = useApi<PlotData[]>({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  const {
    data: cardStats,
    isLoading: loadingCardStats,
    execute: getCardStats
  } = useApi<ApplicationStats>({
    url: "/api/statistics",
    params: {
      id
    }
  });

  const refresh = () => {
    get();
    getCardStats();
  };

  const renderContent = () => {
    return (
      <>
        <StatCards stats={cardStats} isLoading={loadingCardStats} />
        {stats?.length > 0 ? (
          <IncidentsOverviewPlot stats={stats} />
        ) : (
          <DataNotFound label="Incidents metric not found" />
        )}
      </>
    );
  };

  return (
    <>
      <PagePanel
        title="Total Incidents overview"
        extra={<SyncOutlined className="text-xs" onClick={() => refresh()} />}
      >
        {isLoading && loadingCardStats ? (
          <Space className="w-full justify-center">
            <LoadingOutlined />
          </Space>
        ) : (
          renderContent()
        )}
      </PagePanel>
    </>
  );
};
