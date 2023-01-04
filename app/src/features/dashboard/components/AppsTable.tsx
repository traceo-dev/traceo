import { Button, Dropdown, List, Menu } from "antd";
import { useEffect, useState } from "react";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { EmptyAppList } from "./EmptyAppList";
import { SortIcons } from "../../../core/components/SortIcons";
import { SortOrder } from "../../../types/api";
import {
  ApplicationMember,
  SearchApplicationQueryParams
} from "../../../types/application";
import { dispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { AppCard } from "./AppCard";
import { loadApplications } from "../state/actions";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { InputSearch } from "core/ui-components/Input/InputSearch";

export enum AppsSortBy {
  LAST_UPDATE = "updatedAt",
  CREATED_AT = "createdAt",
  LAST_ERROR = "lastIncidentAt"
}

export const handleAppSort: Record<AppsSortBy, string> = {
  [AppsSortBy.CREATED_AT]: "Created at",
  [AppsSortBy.LAST_UPDATE]: "Last update",
  [AppsSortBy.LAST_ERROR]: "Last error"
};

export const AppsTable = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.applications
  );
  const { account } = useSelector((state: StoreState) => state.account);

  const [order, setOrder] = useState<SortOrder>("DESC");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_ERROR);

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
        {Object.values(AppsSortBy).map((sort) => (
          <Menu.Item key={sort}>{handleAppSort[sort]}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={statusContent} placement="bottom">
        <Button className="hover:bg-black hover:text-white focus:bg-black">
          <span>Sort by:</span>
          <span className="font-bold">&nbsp;{handleAppSort[sortBy]}</span>
        </Button>
      </Dropdown>
    );
  };

  const renderSearch = () => (
    <SearchWrapper>
      <InputSearch placeholder="Search by name" value={search} onChange={setSearch} />
      <AppsSortDropdown />
      <SortIcons order={order} setOrder={setOrder} />
    </SearchWrapper>
  );

  return (
    <>
      {renderSearch()}
      <ConditionalWrapper
        isLoading={!hasFetched}
        isEmpty={applications?.length === 0}
        emptyView={<EmptyAppList constraints={search} />}
      >
        <List
          dataSource={applications}
          renderItem={({ application, role }: ApplicationMember) => (
            <List.Item>
              <AppCard app={{ ...application, role }} />
            </List.Item>
          )}
        />
      </ConditionalWrapper>
    </>
  );
};
