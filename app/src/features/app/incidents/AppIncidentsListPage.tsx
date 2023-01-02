import { Button, Divider, Dropdown, Menu, Segmented } from "antd";
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
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { EmptyIncidentsList } from "./components/EmptyIncidentsList";
import PageHeader from "core/components/PageHeader";
import { BarChartOutlined, BugOutlined, LineChartOutlined } from "@ant-design/icons";
import {
  getLocalStorageIncidentPlotType,
  setLocalStorageIncidentPlotType
} from "core/utils/localStorage";
import { INCIDENT_PLOT_TYPE } from "types/metrics";

const handlIncidentSortName: Record<IncidentSortBy, string> = {
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  [IncidentSortBy.ERRORS_COUNT]: "Errors count",
  [IncidentSortBy.STATUS]: "Status"
};

export const AppIncidentsListPage = () => {
  useCleanup((state: StoreState) => state.incident);

  const { id } = useParams();
  const { incidents, hasFetched } = useSelector((state: StoreState) => state.incidents);

  const [search, setSearch] = useState<string>(null);
  const [order, setOrder] = useState<SortOrder>("DESC");
  const [sortBy, setSortBy] = useState<IncidentSortBy>(IncidentSortBy.LAST_SEEN);
  const [status, setStatus] = useState<IncidentStatusSearch>(IncidentStatusSearch.ALL);

  const plot = getLocalStorageIncidentPlotType();
  const [plotType, setPlotType] = useState<INCIDENT_PLOT_TYPE>(plot);

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
        <Button className="hover:bg-black hover:text-white focus:bg-black">
          <span>Status:</span>
          <span className="font-bold">&nbsp;{handleIncidentStatus[status]}</span>
        </Button>
      </Dropdown>
    );
  };

  const IncidentsSortDropdown = () => {
    const sortByContent = (
      <Menu className="w-52" onClick={(val) => setSortBy(val.key as IncidentSortBy)}>
        {Object.values(IncidentSortBy).map((sort) => (
          <Menu.Item key={sort}>{handlIncidentSortName[sort]}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={sortByContent} placement="bottom">
        <Button className="hover:bg-black hover:text-white focus:bg-black">
          <span>Sort by:</span>
          <span className="font-bold">&nbsp;{handleIncidentSort[sortBy]}</span>
        </Button>
      </Dropdown>
    );
  };

  const onChangePlotType = (type: INCIDENT_PLOT_TYPE) => {
    setPlotType(type);
    setLocalStorageIncidentPlotType(type);
  };

  return (
    <AppPage>
      <PageHeader
        icon={<BugOutlined />}
        title="Incidents"
        subTitle="List of incidents catched by Traceo SDK"
      />
      <PagePanel>
        <SearchWrapper className="pt-2 pb-12">
          <SearchInput
            placeholder="Search incidents by type, message, status or assigned user"
            value={search}
            setValue={setSearch}
          />
          <IncidentStatusDropdown />
          <IncidentsSortDropdown />
          <Segmented
            onResize={undefined}
            onResizeCapture={undefined}
            value={plotType}
            onChange={(v) => onChangePlotType(v as INCIDENT_PLOT_TYPE)}
            options={[
              {
                icon: <BarChartOutlined />,
                value: "bar"
              },
              {
                icon: <LineChartOutlined />,
                value: "line"
              }
            ]}
          />
          <SortIcons order={order} setOrder={setOrder} />
        </SearchWrapper>

        <ConditionalWrapper
          isEmpty={incidents?.length === 0}
          isLoading={!hasFetched}
          emptyView={<EmptyIncidentsList constraints={search} />}
        >
          <IncidentTable isLoading={!hasFetched} incidents={incidents} />
        </ConditionalWrapper>
      </PagePanel>
    </AppPage>
  );
};

export default AppIncidentsListPage;
