import { RightOutlined } from "@ant-design/icons";
import { Card, List, Space } from "antd";
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
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { Link } from "core/ui-components/Link/Link";
import { Typography } from "core/ui-components/Typography/Typography";

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
          <Link
            onClick={() =>
              navigate(
                `/app/${application.id}/${slugifyForUrl(application.name)}/incidents`
              )
            }
            className="text-xs font-semibold color-primary"
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
                      <Typography weight="semibold" className="text-primary">
                        {item.type}
                      </Typography>
                      <IncidentStatusTag status={item.status} />
                    </Space>
                    <Typography size="xs">{item.message}</Typography>
                  </Space>
                  <Space>
                    <Typography size="xs">{dateUtils.fromNow(item.lastError)}</Typography>
                    <RightOutlined className="cursor-pointer text-gray-800" />
                  </Space>
                </Space>
              </Card>
            )}
          />
        </ConditionalWrapper>
      </PagePanel>
    </>
  );
};
