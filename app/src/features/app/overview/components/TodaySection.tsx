import { ClockCircleOutlined, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Space } from "antd";
import PageHeader from "../../../../core/components/PageHeader";
import { DailyStats } from "../../../../types/statistics";
import dateUtils from "../../../../core/utils/date";
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
      <PagePanel>
        <PageHeader
          title="Today"
          subTitle={
            <Space className="gap-0 text-xs">
              <ClockCircleOutlined className="mr-1" /> {dateUtils.getNow("HH:mm")}
            </Space>
          }
          suffix={<SyncOutlined className="text-xs" onClick={() => reloadDailyStats()} />}
        />
        {isLoading ? (
          <Space className="w-full justify-center">
            <LoadingOutlined />
          </Space>
        ) : (
          <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{ width: "75%", float: "left" }}>
              <IncidentsTodayPlot stats={stats?.data} />
            </div>
            <div style={{ width: "20%", float: "right" }}>
              <TodayStats stats={stats} />
            </div>
          </div>
        )}
      </PagePanel>
    </>
  );
};
