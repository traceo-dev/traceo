import { useEffect, useState } from "react";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { EmptyAppList } from "./EmptyAppList";
import { SortIcons } from "../../../core/components/SortIcons";
import { SortOrder } from "../../../types/api";
import {
  MemberApplication,
  SearchApplicationQueryParams
} from "../../../types/application";
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { AppCard } from "./AppCard";
import { loadApplications } from "../state/actions";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { InputSearch, Select, List } from "@traceo/ui";
import { useAccount } from "../../../core/hooks/useAccount";

export enum AppsSortBy {
  LAST_UPDATE = "updatedAt",
  CREATED_AT = "createdAt",
  LAST_ERROR = "lastIncidentAt"
}

export const mapAppSortLabel: Record<AppsSortBy, string> = {
  [AppsSortBy.CREATED_AT]: "Created at",
  [AppsSortBy.LAST_UPDATE]: "Last update",
  [AppsSortBy.LAST_ERROR]: "Last error"
};

const sortOptions = Object.values(AppsSortBy).map((sort) => ({
  value: sort,
  label: mapAppSortLabel[sort]
}));

export const AppsTable = () => {
  const dispatch = useAppDispatch();
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.applications
  );
  const account = useAccount();

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
