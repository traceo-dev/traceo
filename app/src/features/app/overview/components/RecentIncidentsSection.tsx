import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { Card, List, Space, Typography } from "antd";
import { IncidentStatusTag } from "src/core/components/IncidentStatusTag";
import PageHeader from "src/core/components/PageHeader";
import { useApi } from "src/core/lib/useApi";
import { Incident, IncidentSortBy, IncidentStatusSearch } from "src/types/incidents";
import dateUtils from "src/core/utils/date";
import { useNavigate } from "react-router-dom";
import { PagePanel } from "src/core/components/PagePanel";
import { slugifyForUrl } from "src/core/utils/stringUtils";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";

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
      <PagePanel>
        <PageHeader
          className="w-full"
          suffix={
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
          title="Recent Incidents"
          subTitle="Last incidents captured by Traceo SDK connected to your app"
        />
        {isLoading ? (
          <Space className="w-full my-8 justify-center">
            <LoadingOutlined />
          </Space>
        ) : incidents?.length ? (
          <List
            loading={isLoading}
            dataSource={incidents || []}
            className="pt-8"
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
          <Space className="w-full justify-center my-12">No data</Space>
        )}
      </PagePanel>
    </>
  );
};
