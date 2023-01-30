import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SortIcons } from "../../../core/components/SortIcons";
import { IncidentTable } from "./components/IncidentTable";
import { ApiQueryParams } from "../../../core/lib/api";
import { useAppDispatch } from "../../../store";
import { IncidentSortBy, IncidentStatusSearch } from "../../../types/incidents";
import { StoreState } from "../../../types/store";
import { loadIncidents } from "./state/actions";
import { useParams } from "react-router-dom";
import { SortOrder } from "../../../types/api";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { EmptyIncidentsList } from "./components/EmptyIncidentsList";
import { BugOutlined } from "@ant-design/icons";
import {
  getLocalStorageIncidentPlotType,
  setLocalStorageIncidentPlotType
} from "../../../core/utils/localStorage";
import { INCIDENT_PLOT_TYPE } from "../../../types/metrics";
import { InputSearch, Select, Card, RadioButtonGroup } from "@traceo/ui";
import { changeBarOptions, searchStatusOptions, sortOptions } from "./components/utils";
import { resetIncidentState } from "./state/reducers";
import { Page } from "../../../core/components/Page";

export const IncidentsListPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    dispatch(resetIncidentState());
  }, []);

  useEffect(() => {
    dispatch(loadIncidents(queryParams));
  }, [order, sortBy, status, search]);

  const onChangePlotType = (type: INCIDENT_PLOT_TYPE) => {
    setPlotType(type);
    setLocalStorageIncidentPlotType(type);
  };

  return (
    <Page
      header={{
        icon: <BugOutlined />,
        title: "Incidents",
        description: "List of incidents catched by Traceo SDK"
      }}
    >
      <Page.Content>
        <Card>
          <SearchWrapper className="pt-2 pb-12">
            <InputSearch
              placeholder="Search incidents by type, message, status or assigned user"
              value={search}
              onChange={setSearch}
            />
            <Select
              placeholder="Select status"
              width={150}
              options={searchStatusOptions}
              value={status}
              onChange={(opt) => setStatus(opt?.value)}
              isClearable
            />
            <Select
              placeholder="Sort by"
              width={150}
              options={sortOptions}
              value={sortBy}
              onChange={(opt) => setSortBy(opt?.value)}
              isClearable
            />
            <RadioButtonGroup
              onChange={onChangePlotType}
              value={plotType}
              options={changeBarOptions}
              size="sm"
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
        </Card>
      </Page.Content>
    </Page>
  );
};

export default IncidentsListPage;
