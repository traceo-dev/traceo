import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import { useApplication } from "../../../../core/hooks/useApplication";
import { useRequest } from "../../../../core/hooks/useRequest";
import dateUtils from "../../../../core/utils/date";
import { RightOutlined } from "@ant-design/icons";
import { IIncident, IncidentSortBy, IncidentStatusSearch } from "@traceo/types";
import { Link, Typography, Card, ListCard, Space, List } from "@traceo/ui";
import { useNavigate } from "react-router-dom";

export const RecentIncidentsSection = () => {
  const { application } = useApplication();
  const navigate = useNavigate();

  const queryParams = {
    id: application.id,
    order: "DESC",
    sortBy: IncidentSortBy.LAST_SEEN,
    status: IncidentStatusSearch.ALL,
    take: 5
  };

  const { data: incidents = [], isLoading } = useRequest<IIncident[]>({
    url: "/api/incidents",
    params: queryParams
  });

  return (
    <Card
      title="Recent Incidents"
      extra={
        <Link
          onClick={() => navigate(`/app/${application.id}/incidents`)}
          className="text-xs font-semibold"
        >
          View
        </Link>
      }
    >
      <ConditionalWrapper
        isLoading={isLoading}
        isEmpty={incidents && incidents.length === 0}
        emptyView={<DataNotFound label="Incidents not found" />}
      >
        <List
          loading={isLoading}
          className="pt-2"
          dataSource={incidents || []}
          renderItem={(item: IIncident) => (
            <ListCard
              onClick={() => navigate(`/app/${application.id}/incidents/${item.id}/details`)}
            >
              <Space className="w-full justify-between py-2">
                <Space direction="vertical" className="gap-0">
                  <Space>
                    <Typography weight="semibold" className="text-primary">
                      {item.type}
                    </Typography>
                    <IncidentStatusTag className="ml-2" status={item.status} />
                  </Space>
                  <Typography size="xs">{item.message}</Typography>
                </Space>
                <Space>
                  <Typography size="xs">{dateUtils.fromNow(item.lastError)}</Typography>
                  <RightOutlined className="cursor-pointer text-gray-800" />
                </Space>
              </Space>
            </ListCard>
          )}
        />
      </ConditionalWrapper>
    </Card>
  );
};
