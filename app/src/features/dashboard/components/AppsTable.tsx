import { Button, Col, Dropdown, Menu, Row } from "antd";
import { useEffect, useState } from "react";
import { ConditionLayout } from "../../../core/components/ConditionLayout";
import { EmptyAppList } from "./EmptyAppList";
import { SearchInput } from "../../../core/components/SearchInput";
import { SortIcons } from "../../../core/components/SortIcons";
import { SortOrder } from "../../../types/api";
import { SearchApplicationQueryParams } from "../../../types/application";
import { dispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { AppCard } from "./AppCard";
import { loadApplications } from "../state/actions";
import { SearchWrapper } from "core/components/SearchWrapper";

export enum AppsSortBy {
  LAST_UPDATE = "application.updatedAt",
  CREATED_AT = "application.createdAt",
  LAST_INCIDENT = "application.lastIncidentAt"
}

export const handleAppSort: Record<AppsSortBy, string> = {
  [AppsSortBy.CREATED_AT]: "Created at",
  [AppsSortBy.LAST_UPDATE]: "Last update",
  [AppsSortBy.LAST_INCIDENT]: "Last incident"
};

export const AppsTable = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.applications
  );
  const { account } = useSelector((state: StoreState) => state.account);

  const [order, setOrder] = useState<SortOrder>("ASC");
  const [search, setSearch] = useState<string>(null);
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_INCIDENT);

  const queryParams: SearchApplicationQueryParams = {
    order,
    sortBy,
    search: search,
    accountId: account?.id
  };

  useEffect(() => fetchApplications(), []);
  useEffect(() => fetchApplications(), [order, sortBy, search]);
  const fetchApplications = () => dispatch(loadApplications(queryParams));

  const onSearch = (val: string) => setSearch(val);

  const AppsSortDropdown = () => {
    const statusContent = (
      <Menu className="w-52" onClick={(val) => setSortBy(val.key as AppsSortBy)}>
        <Menu.Item key={AppsSortBy.LAST_INCIDENT}>Last incident</Menu.Item>
        <Menu.Item key={AppsSortBy.CREATED_AT}>Created at</Menu.Item>
        <Menu.Item key={AppsSortBy.LAST_UPDATE}>Last update</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={statusContent} placement="bottom">
        <Button>
          <span>Sort by:</span>
          <span className="font-bold">&nbsp;{handleAppSort[sortBy]}</span>
        </Button>
      </Dropdown>
    );
  };

  const SearchHeader = () => (
    <SearchWrapper>
      <SearchInput placeholder="Search by name" value={search} setValue={onSearch} />
      <AppsSortDropdown />
      <SortIcons order={order} setOrder={setOrder} />
    </SearchWrapper>
  );

  return (
    <>
      <SearchHeader />
      <ConditionLayout
        isLoading={!hasFetched}
        isEmpty={applications?.length === 0}
        emptyView={<EmptyAppList constraints={search} />}
      >
        <Row className="pt-5" gutter={[8, 24]}>
          {applications?.map((app, index) => (
            <Col key={index} span={8}>
              <AppCard app={app} />
            </Col>
          ))}
        </Row>
      </ConditionLayout>
    </>
  );
};
