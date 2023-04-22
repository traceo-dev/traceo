import { BellOutlined, PlusOutlined } from "@ant-design/icons";
import { AlertStatus, IAlert, PaginateType, SortOrder } from "@traceo/types";
import {
  Button,
  Card,
  InputSearch,
  Select,
  SelectOptionProps,
  Table,
  TableColumn
} from "@traceo/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "src/core/components/Page";
import { SearchWrapper } from "src/core/components/SearchWrapper";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import dateUtils from "src/core/utils/date";
import { mapAlertTypeToName, mapSeverityToSpan, mapStatusToTag } from "./utils";
import { useAppDispatch } from "src/store/index";
import { resetAlertState } from "./state/alert.slice";
import { SortIcons } from "src/core/components/SortIcons";

const alertStatusOptions: SelectOptionProps[] = Object.values(AlertStatus).map((e) => ({
  label: e,
  value: e
}));

enum AlertSortby {
  LAST_TRIGGERED = "lastTriggered",
  FIRST_SEEN = "createdAt",
  STATUS = "status"
}

const alertSortOptions: SelectOptionProps[] = Object.values(AlertSortby).map((e) => ({
  label: e,
  value: e
}));

const ALERT_PAGE_SIZE = 15;
const AlertsListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [search, setSearch] = useState<string>(null);
  const [order, setOrder] = useState<SortOrder>("DESC");
  const [sortBy, setSortBy] = useState();
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
      sortBy,
      status,
      page,
      take: ALERT_PAGE_SIZE
    }
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setPage(1);
    setTimeout(() => {
      refetch();
    }, 0);
  }, [order, sortBy, status, search]);

  useEffect(() => {
    dispatch(resetAlertState());
  }, []);

  const onKeyDown = (event: any) => event.keyCode === 13 && setSearch(event.target.value);

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
            Create new
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
              value={search}
              onKeyDown={onKeyDown}
            />
            <Select
              placeholder="Select status"
              width={150}
              options={alertStatusOptions}
              value={status}
              onChange={(opt) => setStatus(opt?.value)}
              isClearable
            />
            <Select
              placeholder="Sort by"
              width={150}
              options={alertSortOptions}
              value={sortBy}
              onChange={(opt) => setSortBy(opt?.value)}
              isClearable
            />
            <SortIcons order={order} setOrder={setOrder} />
          </SearchWrapper>
          <Table
            showPagination
            striped
            collection={response?.result}
            rowsCount={response?.totalCount}
            loading={isLoading || isFetching}
            currentPage={page}
            pageSize={ALERT_PAGE_SIZE}
            onRowClick={(alert) => navigate(`/project/${id}/alerting/${alert.id}/details`)}
          >
            <TableColumn name="Name" value="name" />
            <TableColumn name="Status">{({ item }) => mapStatusToTag[item.status]}</TableColumn>
            <TableColumn name="Severity">
              {({ item }) => mapSeverityToSpan[item.severity]}
            </TableColumn>
            <TableColumn name="Last triggered">
              {({ item }) => <span>{dateUtils.fromNow(item.lastTriggered)}</span>}
            </TableColumn>
            <TableColumn name="Type">{({ item }) => mapAlertTypeToName[item.type]}</TableColumn>
            <TableColumn name="Rules count">
              {({ item }) => <span>{item?.rules.length} rules</span>}
            </TableColumn>
          </Table>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default AlertsListPage;
