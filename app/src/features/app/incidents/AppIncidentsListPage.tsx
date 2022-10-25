import { Button, Dropdown, Menu, Typography } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AppPage from "../components/AppPage";
import { SearchInput } from "../../../core/components/SearchInput";
import { SortIcons } from "../../../core/components/SortIcons";
import { IncidentTable } from "../../../features/app/incidents/components/IncidentTable";
import { useCleanup } from "../../../core/hooks/useCleanup";
import { ApiQueryParams } from "../../../core/lib/api";
import { dispatch } from "../../../store/store";
import {
  handleIncidentSort,
  handleIncidentStatus,
  IncidentSortBy,
  IncidentStatusSearch
} from "../../../types/incidents";
import { StoreState } from "../../../types/store";
import { loadIncidents } from "../../../features/app/incidents/state/actions";
import { useParams } from "react-router-dom";
import { SortOrder } from "../../../types/api";
import { PagePanel } from "../../../core/components/PagePanel";
import { ConditionLayout } from "../../../core/components/ConditionLayout";
import { BatchUpdateModal } from "../../../core/components/Modals/BatchUpdateModal";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { SearchWrapper } from "../../../core/components/SearchWrapper";

export const AppIncidentsListPage = () => {
  useCleanup((state: StoreState) => state.incident);

  const { id } = useParams();
  const { incidents, hasFetched } = useSelector((state: StoreState) => state.incidents);

  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [isBatchVisible, setBatchVisible] = useState<boolean>(false);

  const [search, setSearch] = useState<string>(null);
  const [order, setOrder] = useState<SortOrder>("DESC");
  const [sortBy, setSortBy] = useState<IncidentSortBy>(IncidentSortBy.LAST_SEEN);
  const [status, setStatus] = useState<IncidentStatusSearch>(IncidentStatusSearch.ALL);

  const queryParams: ApiQueryParams = {
    id,
    search: search ?? null,
    order,
    sortBy,
    status
  };

  useEffect(() => fetchIncidents(), []);

  useEffect(() => {
    fetchIncidents();
  }, [order, sortBy, status, search]);

  const fetchIncidents = () => dispatch(loadIncidents(queryParams));

  const IncidentStatusDropdown = () => {
    const statusContent = (
      <Menu
        className="w-52"
        onClick={(val) => setStatus(val.key as IncidentStatusSearch)}
      >
        {Object.values(IncidentStatusSearch).map((status) => (
          <Menu.Item key={status}>{handleIncidentStatus[status]}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={statusContent} placement="bottom">
        <Button>
          <span>Status:</span>
          <span className="font-bold">&nbsp;{handleIncidentStatus[status]}</span>
        </Button>
      </Dropdown>
    );
  };

  const IncidentsSortDropdown = () => {
    const sortByContent = (
      <Menu className="w-52" onClick={(val) => setSortBy(val.key as IncidentSortBy)}>
        <Menu.Item key={IncidentSortBy.LAST_SEEN}>Last seen</Menu.Item>
        <Menu.Item key={IncidentSortBy.FIRST_SEEN}>First seen</Menu.Item>
        <Menu.Item key={IncidentSortBy.STATUS}>Status</Menu.Item>
        <Menu.Item key={IncidentSortBy.OCCUR_COUNT}>Occur count</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={sortByContent} placement="bottom">
        <Button>
          <span>Sort by:</span>
          <span className="font-bold">&nbsp;{handleIncidentSort[sortBy]}</span>
        </Button>
      </Dropdown>
    );
  };

  return (
    <>
      <AppPage>
        <PagePanel title="Incidents">
          <SearchWrapper>
            <SearchInput
              placeholder="Search incidents by type, message, status or assigned user"
              value={search}
              setValue={setSearch}
            />
            <IncidentStatusDropdown />
            <IncidentsSortDropdown />
            <SortIcons order={order} setOrder={setOrder} />

            {selectedIncidents?.length > 0 && (
              <Button type="primary" onClick={() => setBatchVisible(true)}>
                <Typography.Text className="text-white">Batch update</Typography.Text>
                <Typography.Text className="pl-2 text-amber-500">
                  {selectedIncidents?.length}
                </Typography.Text>
              </Button>
            )}
          </SearchWrapper>

          <ConditionLayout
            isEmpty={incidents?.length === 0}
            isLoading={!hasFetched}
            emptyView={
              <DataNotFound
                className="text-2xl mt-12"
                label="Incidents not found"
                explanation="Great! You have nothing to worry about at this point!"
              />
            }
          >
            <IncidentTable
              isLoading={!hasFetched}
              incidents={incidents}
              selectedIncidents={selectedIncidents}
              setSelectedIncidents={setSelectedIncidents}
            />
          </ConditionLayout>
        </PagePanel>
      </AppPage>

      <BatchUpdateModal
        incidentsIds={selectedIncidents}
        isOpen={isBatchVisible}
        onClose={() => {
          setBatchVisible(false);
          setSelectedIncidents([]);
        }}
      />
    </>
  );
};

export default AppIncidentsListPage;
