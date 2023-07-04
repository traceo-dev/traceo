import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { useProject } from "../../../../core/hooks/useProject";
import dateUtils from "../../../../core/utils/date";
import { RightOutlined } from "@ant-design/icons";
import {
  IIncident,
  IncidentSortBy,
  IncidentStatusSearch,
  mapIncidentStatus,
  PaginateType
} from "@traceo/types";
import { Typography, ListCard, Space, List, Tooltip } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { mapHeaderStatusIcon } from "../../incidents/components/utils";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { RouterLink } from "../../../../core/components/RouterLink";
import { DashboardPanel } from "../../../../core/components/DashboardPanel";

const RECENT_INCIDENTS_MAX_COUNT = 5;
export const RecentIncidentsSection = () => {
  const { project } = useProject();
  const navigate = useNavigate();

  const queryParams = {
    id: project.id,
    order: "DESC",
    sortBy: IncidentSortBy.FIRST_SEEN,
    status: IncidentStatusSearch.ALL,
    take: RECENT_INCIDENTS_MAX_COUNT
  };

  const { data: response, isLoading } = useReactQuery<PaginateType<IIncident>>({
    queryKey: ["recent_incidents"],
    url: "/api/incidents",
    params: queryParams
  });

  return (
    <DashboardPanel
      name="Recent Incidents"
      loading={isLoading}
      options={
        <RouterLink to={`/project/${project.id}/incidents`} className="text-xs font-semibold">
          View
        </RouterLink>
      }
    >
      <ConditionalWrapper
        isEmpty={response && response?.result.length === 0}
        emptyView={<DataNotFound label="Incidents not found" />}
      >
        <List
          loading={isLoading}
          className="pt-2"
          dataSource={(response && response?.result) || []}
          renderItem={(item: IIncident) => (
            <ListCard
              onClick={() => navigate(`/project/${project.id}/incidents/${item.id}/details`)}
            >
              <Space className="w-full justify-between">
                <Space direction="horizontal" className="gap-0">
                  <Tooltip title={mapIncidentStatus[item.status]}>
                    {mapHeaderStatusIcon[item.status]}
                  </Tooltip>
                  <Space direction="vertical" className="pl-3">
                    <Typography weight="semibold" className="text-primary">
                      {item.name}
                    </Typography>
                    <Typography size="xs">{item.message}</Typography>
                  </Space>
                </Space>
                <Space>
                  <Typography size="xs">{dateUtils.fromNow(item.lastEventAt)}</Typography>
                  <RightOutlined className="cursor-pointer text-gray-800" />
                </Space>
              </Space>
            </ListCard>
          )}
        />
      </ConditionalWrapper>
    </DashboardPanel>
  );
};
