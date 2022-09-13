import { Space } from "antd";
import PageHeader from "../../../../core/components/PageHeader";
import { StatCards } from "./StatCards";
import { useApi } from "../../../../core/lib/useApi";
import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { PagePanel } from "../../../../core/components/PagePanel";
import { AppOverviewPlot } from "../../../../core/components/Plots/components/AppOverviewPlot";
import { ApplicationStats } from "../../../../types/statistics";

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data: stats = [],
    isLoading,
    execute: get
  } = useApi({
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

  return (
    <>
      <PagePanel>
        <PageHeader
          className="w-full"
          title="Total overview"
          subTitle="Informations about your app from start of using Traceo SDK"
          suffix={<SyncOutlined className="text-xs" onClick={() => refresh()} />}
        />

        {isLoading && loadingCardStats ? (
          <Space className="w-full justify-center">
            <LoadingOutlined />
          </Space>
        ) : (
          <>
            <StatCards stats={cardStats} isLoading={loadingCardStats} />
            <AppOverviewPlot stats={stats} />
          </>
        )}
      </PagePanel>
    </>
  );
};
