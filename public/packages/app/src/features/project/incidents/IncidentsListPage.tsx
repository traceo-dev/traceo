import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { SortIcons } from "../../../core/components/SortIcons";
import { localStorageService } from "../../../core/lib/localStorage";
import { LocalStorage } from "../../../core/lib/localStorage/types";
import { useAppDispatch } from "../../../store";
import { IncidentsTable } from "./components/IncidentsTable";
import { changeBarOptions, searchStatusOptions, sortOptions } from "./components/utils";
import {
  IncidentSortBy,
  IncidentStatusSearch,
  SortOrder,
  INCIDENT_PLOT_TYPE,
  IIncident,
  PaginateType
} from "@traceo/types";
import { InputSearch, Select, Card, RadioButtonGroup, Row } from "@traceo/ui";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AlertOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { resetIncidentState } from "./state/slices/incident.slice";
import { resetGroupedEvents } from "./state/slices/grouped-events.slice";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { ActionButton } from "../../../core/components/ActionButton";

const INCIDENT_PAGE_SIZE = 15;

export const IncidentsListPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState<string>(null);
  const [order, setOrder] = useState<SortOrder>("DESC");
  const [sortBy, setSortBy] = useState<IncidentSortBy>(IncidentSortBy.LAST_SEEN);
  const [status, setStatus] = useState<IncidentStatusSearch>(IncidentStatusSearch.ALL);
  const [page, setPage] = useState<number>(1);

  const plot = localStorageService.get<any>(LocalStorage.PlotType) || "bar";
  const [plotType, setPlotType] = useState<INCIDENT_PLOT_TYPE>(plot);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch
  } = useReactQuery<PaginateType<IIncident>>({
    queryKey: ["incidents"],
    url: "/api/incidents",
    params: { id, search: search ?? null, order, sortBy, status, page, take: INCIDENT_PAGE_SIZE }
  });

  useEffect(() => {
    // cleanning incident store
    dispatch(resetIncidentState());
    dispatch(resetGroupedEvents());
  }, []);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // After criteria mutation we have to back to first page,
    // to avoid use case that with eq. single row we are on x page
    setPage(1);
    // Using setTimeout because setters are async, so we wait 250ms after setPage to trigger refetch
    setTimeout(() => {
      refetch();
    }, 0);
  }, [order, sortBy, status, search]);

  const onChangePlotType = (type: INCIDENT_PLOT_TYPE) => {
    setPlotType(type);
    localStorageService.set(LocalStorage.PlotType, type);
  };

  const onKeyDown = (event: any) => event.keyCode === 13 && setSearch(event.target.value);

  return (
    <Page
      header={{
        title: "Incidents",
        description: "List of incidents catched by Traceo SDK connected to your project",
        icon: <AlertOutlined />
      }}
    >
      <Page.Content className="pt-1">
        <Card>
          <Row className="pb-5" gap="x-2">
            <InputSearch
              placeholder="Search incidents by name, message, status or assigned user"
              value={search}
              onKeyDown={onKeyDown}
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
            <ActionButton
              inactiveColor="bg-canvas"
              icon={order === "ASC" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => setOrder(order === "ASC" ? "DESC" : "ASC")}
            />
          </Row>

          <IncidentsTable
            onPageChange={setPage}
            isLoading={isLoading || isFetching}
            incidents={response?.result}
            rowsCount={response?.totalCount}
            page={page}
          />
        </Card>
      </Page.Content>
    </Page>
  );
};

export default IncidentsListPage;
