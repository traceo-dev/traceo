import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { DailyStats } from "../../../../types/statistics";
import { useParams } from "react-router-dom";
import { useApi } from "../../../../core/lib/useApi";
import { PagePanel } from "../../../../core/components/PagePanel";
import { TodayStats } from "./TodayStats";
import { IncidentsTodayPlot } from "../../../../core/components/Plots/components/IncidentsTodayPlot";

export const TodaySection = () => {
  const { id } = useParams();

  const {
    data: stats,
    isLoading,
    execute: get
  } = useApi<DailyStats>({
    url: "/api/statistics/daily",
    params: {
      id
    }
  });

  const reloadDailyStats = () => {
    get();
  };

  return (
    <>
      <PagePanel
        title="Today"
        extra={<SyncOutlined className="text-xs" onClick={() => reloadDailyStats()} />}
      >
        {isLoading ? (
          <Space className="w-full justify-center">
            <LoadingOutlined />
          </Space>
        ) : (
          <div className="w-full overflow-hidden">
            <div className="w-3/4 float-left">
              <IncidentsTodayPlot stats={stats?.data} />
            </div>
            <div className="w-1/4 float-right pl-12">
              <TodayStats stats={stats} />
            </div>
          </div>
        )}
      </PagePanel>
    </>
  );
};
