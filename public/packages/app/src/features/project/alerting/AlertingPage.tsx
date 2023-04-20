import { BellOutlined, PlusOutlined } from "@ant-design/icons";
import { AlertStatus, IAlert, PaginateType, SortOrder } from "@traceo/types";
import { Button, Card, InputSearch, Select, Table, TableColumn } from "@traceo/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "src/core/components/Page";
import { SearchWrapper } from "src/core/components/SearchWrapper";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import dateUtils from "src/core/utils/date";
import { mapAlertTypeToName, mapSeverityToSpan, mapStatusToTag } from "./utils";

const ALERT_PAGE_SIZE = 15;
const AlertingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [search, setSearch] = useState<string>(null);
  const [order, setOrder] = useState<SortOrder>("DESC");
  // const [sortBy, setSortBy] = useState<IncidentSortBy>(IncidentSortBy.LAST_SEEN);
  const [status, setStatus] = useState<AlertStatus>(null);
  const [page, setPage] = useState<number>(1);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch
  } = useReactQuery<PaginateType<IAlert>>({
    queryKey: ["alerts"],
    url: "/api/alert",
    params: {
      projectId: id,
      search: search ?? null,
      order,
      // sortBy,
      status,
      page,
      take: ALERT_PAGE_SIZE
    }
  });

  return (
    <Page
      header={{
        title: "Alerting",
        description: "Get informed about disturbing behavior as soon as it occurs.",
        icon: <BellOutlined />,
        suffix: (
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate(`/project/${id}/alerting/create`)}
          >
            Create new rule
          </Button>
        )
      }}
    >
      <Page.Content>
        <Card>
          <SearchWrapper className="pt-2 pb-12">
            <InputSearch
              loading={isFetching}
              placeholder="Search alert by name, description, type or severity"
              value={""}
            />
            <Select options={[]} />
          </SearchWrapper>
          <Table
            showPagination
            striped
            collection={response?.result}
            rowsCount={response?.totalCount}
            loading={isLoading}
            currentPage={page}
            pageSize={ALERT_PAGE_SIZE}
          >
            <TableColumn name="Name" value="name" />
            <TableColumn name="Status">{({ item }) => mapStatusToTag[item.status]}</TableColumn>
            <TableColumn name="Type">{({ item }) => mapAlertTypeToName[item.type]}</TableColumn>
            <TableColumn name="Severity">
              {({ item }) => mapSeverityToSpan[item.severity]}
            </TableColumn>
            <TableColumn name="Last triggered">
              {({ item }) => <span>{dateUtils.fromNow(item.lastTriggered)}</span>}
            </TableColumn>
            <TableColumn name="Rules count">
              {({ item }) => <span>{item?.rules.length} rules</span>}
            </TableColumn>
          </Table>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default AlertingPage;
