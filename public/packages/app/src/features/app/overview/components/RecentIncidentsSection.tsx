import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { useApplication } from "../../../../core/hooks/useApplication";
import { useRequest } from "../../../../core/hooks/useRequest";
import dateUtils from "../../../../core/utils/date";
import { RightOutlined } from "@ant-design/icons";
import {
  IIncident,
  IncidentSortBy,
  IncidentStatusSearch,
  mapIncidentStatus
} from "@traceo/types";
import { Link, Typography, Card, ListCard, Space, List, Tooltip } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { mapHeaderStatusIcon } from "../../incidents/components/utils";

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
                <Space direction="horizontal" className="gap-0">
                  <Tooltip title={mapIncidentStatus[item.status]}>
                    {mapHeaderStatusIcon[item.status]}
                  </Tooltip>
                  <Space direction="vertical" className="pl-3">
                    <Typography weight="semibold" className="text-primary">
                      {item.type}
                    </Typography>
                    <Typography size="xs">{item.message}</Typography>
                  </Space>
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
