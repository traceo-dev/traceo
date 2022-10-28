import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { Card, List, Space, Typography } from "antd";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import { useApi } from "../../../../core/lib/useApi";
import {
  Incident,
  IncidentSortBy,
  IncidentStatusSearch
} from "../../../../types/incidents";
import dateUtils from "../../../../core/utils/date";
import { useNavigate } from "react-router-dom";
import { PagePanel } from "../../../../core/components/PagePanel";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { DataNotFound } from "../../../../core/components/DataNotFound";

export const RecentIncidentsSection = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  const queryParams = {
    id: application.id,
    order: "DESC",
    sortBy: IncidentSortBy.LAST_SEEN,
    status: IncidentStatusSearch.ALL,
    take: 5
  };

  const { data: incidents = [], isLoading } = useApi<Incident[]>({
    url: "/api/incidents",
    params: queryParams
  });

  return (
    <>
      <PagePanel
        title="Recent Incidents"
        extra={
          <Typography.Link
            onClick={() =>
              navigate(
                `/app/${application.id}/${slugifyForUrl(application.name)}/incidents`
              )
            }
            className="text-xs font-semibold color-primary"
          >
            View
          </Typography.Link>
        }
      >
        {isLoading ? (
          <Space className="w-full my-8 justify-center">
            <LoadingOutlined />
          </Space>
        ) : incidents?.length ? (
          <List
            loading={isLoading}
            dataSource={incidents || []}
            className="pt-2"
            renderItem={(item: Incident) => (
              <Card
                onClick={() =>
                  navigate(
                    `/app/${application.id}/${slugifyForUrl(
                      application.name
                    )}/incidents/${item.id}/details`
                  )
                }
                className="default-card default-card-body"
              >
                <Space className="w-full justify-between py-2">
                  <Space direction="vertical" className="gap-0">
                    <Space>
                      <Typography.Link className="font-semibold text-primary">
                        {item.type}
                      </Typography.Link>
                      <IncidentStatusTag status={item.status} />
                    </Space>
                    <Typography.Text className="text-xs">{item.message}</Typography.Text>
                  </Space>
                  <Space>
                    <Typography.Text className="text-xs">
                      {dateUtils.fromNow(item.lastOccur)}
                    </Typography.Text>
                    <RightOutlined className="cursor-pointer text-gray-800" />
                  </Space>
                </Space>
              </Card>
            )}
          />
        ) : (
          <DataNotFound label="Incidents not found" />
        )}
      </PagePanel>
    </>
  );
};
