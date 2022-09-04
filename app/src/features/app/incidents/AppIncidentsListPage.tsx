import { Button, Menu, Space, Typography } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BatchUpdateDrawer } from "src/core/components/Drawers/BatchUpdateDrawer";
import AppPage from "src/core/components/Layout/Pages/AppPage";
import { SearchInput } from "src/core/components/SearchInput";
import { SortIcons } from "src/core/components/SortIcons";
import { IncidentTable } from "src/features/app/incidents/components/IncidentTable";
import { useCleanup } from "src/core/hooks/useCleanup";
import { ApiQueryParams } from "src/core/lib/api";
import { dispatch } from "src/store/store";
import {
  handleIncidentStatus,
  IncidentSortBy,
  IncidentStatusSearch
} from "src/types/incidents";
import { StoreState } from "src/types/store";
import { loadIncidents } from "src/features/app/incidents/state/actions";
import { useParams } from "react-router-dom";
import { SortOrder } from "src/types/api";
import PageHeader from "src/core/components/PageHeader";
import { PagePanel } from "src/core/components/PagePanel";
import { BugOutlined } from "@ant-design/icons";
import { IncidentsSortDropdown } from "./components/IncidentsSortDropdown";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { EmptyIncidentList } from "src/core/components/EmptyViews/EmptyIncidentList";
import { handleAppSort } from "src/core/utils/handlers";
import { StatusDropdown } from "src/core/components/StatusDropdown";

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

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [order, sortBy, status]);

  const fetchIncidents = () => {
    dispatch(loadIncidents(queryParams));
  };

  const dropdownSearchStatuses = (
    <Menu
      style={{ width: 200 }}
      onClick={(val) => setStatus(val.key as IncidentStatusSearch)}
    >
      {Object.values(IncidentStatusSearch).map((status) => (
        <Menu.Item key={status} className="capitalize">
          {status}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <AppPage>
        <PageHeader
          icon={<BugOutlined />}
          title="Incidents"
          className="pt-0"
          subTitle="All incidents picked up by the SDK pinned into the application."
        />
        <PagePanel>
          <Space className="pb-2 w-full justify-between">
            <Space className="w-full">
              <SearchInput
                placeholder="Search"
                value={search}
                loading={!hasFetched}
                setValue={setSearch}
                get={() => fetchIncidents()}
              />
              <StatusDropdown
                overlay={dropdownSearchStatuses}
                value={handleIncidentStatus[status]}
              />

              <IncidentsSortDropdown setSortBy={setSortBy} sortBy={sortBy} />
              <SortIcons order={order} setOrder={setOrder} />
            </Space>

            {selectedIncidents?.length > 0 && (
              <Button type="primary" onClick={() => setBatchVisible(true)}>
                <Typography.Text className="text-white">Batch update</Typography.Text>
                <Typography.Text className="pl-2 text-amber-500">
                  {selectedIncidents?.length}
                </Typography.Text>
              </Button>
            )}
          </Space>

          <ConditionLayout
            isEmpty={incidents?.length === 0 && hasFetched}
            emptyView={<EmptyIncidentList constraints={search} />}
          >
            <IncidentTable
              isLoading={!hasFetched}
              incidents={incidents}
              setSelectedIncidents={setSelectedIncidents}
            />
          </ConditionLayout>
        </PagePanel>
      </AppPage>

      <BatchUpdateDrawer
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
