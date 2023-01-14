import { useEffect, useState } from "react";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { EmptyAppList } from "./EmptyAppList";
import { SortIcons } from "../../../core/components/SortIcons";
import { SortOrder } from "../../../types/api";
import {
  MemberApplication,
  SearchApplicationQueryParams
} from "../../../types/application";
import { dispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { AppCard } from "./AppCard";
import { loadApplications } from "../state/actions";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { InputSearch } from "core/ui-components/Input/InputSearch";
import { Select } from "core/ui-components/Select";
import { List } from "core/ui-components/List";

export enum AppsSortBy {
  LAST_UPDATE = "updatedAt",
  CREATED_AT = "createdAt",
  LAST_ERROR = "lastIncidentAt"
}

export const handleAppSortLabel: Record<AppsSortBy, string> = {
  [AppsSortBy.CREATED_AT]: "Created at",
  [AppsSortBy.LAST_UPDATE]: "Last update",
  [AppsSortBy.LAST_ERROR]: "Last error"
};

const sortOptions = Object.values(AppsSortBy).map((sort) => ({
  value: sort,
  label: handleAppSortLabel[sort]
}));

export const AppsTable = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.applications
  );
  const { account } = useSelector((state: StoreState) => state.account);

  const [order, setOrder] = useState<SortOrder>("DESC");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_ERROR);

  useEffect(() => fetchApplications(), [order, sortBy, search]);

  const fetchApplications = () => {
    const queryParams: SearchApplicationQueryParams = {
      order,
      sortBy,
      search: search,
      accountId: account?.id
    };
    dispatch(loadApplications(queryParams));
  };

  const renderSearch = () => (
    <SearchWrapper>
      <InputSearch placeholder="Search by name" value={search} onChange={setSearch} />
      <Select
        width={150}
        options={sortOptions}
        value={sortBy}
        onChange={(opt) => setSortBy(opt?.value)}
        isClearable
      />
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
          className="pt-5"
          dataSource={applications}
          renderItem={(app: MemberApplication) => <AppCard app={app} />}
        />
      </ConditionalWrapper>
    </>
  );
};
