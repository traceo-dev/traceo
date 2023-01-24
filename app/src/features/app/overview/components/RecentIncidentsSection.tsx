import { RightOutlined } from "@ant-design/icons";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import { useRequest } from "../../../../core/hooks/useRequest";
import {
  Incident,
  IncidentSortBy,
  IncidentStatusSearch
} from "../../../../types/incidents";
import dateUtils from "../../../../core/utils/date";
import { useNavigate } from "react-router-dom";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { Link } from "core/ui-components/Link";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { ListCard } from "core/ui-components/Card/ListCard";
import { Space } from "core/ui-components/Space";
import { List } from "core/ui-components/List";
import { useApplication } from "core/hooks/useApplication";

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

  const { data: incidents = [], isLoading } = useRequest<Incident[]>({
    url: "/api/incidents",
    params: queryParams
  });

  return (
    <Card
      title="Recent Incidents"
      extra={
        <Link
          onClick={() => navigate(`/app/${application.id}/incidents`)}
          className="text-xs font-semibold text-primary"
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
          renderItem={(item: Incident) => (
            <ListCard
              onClick={() =>
                navigate(`/app/${application.id}/incidents/${item.id}/details`)
              }
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
