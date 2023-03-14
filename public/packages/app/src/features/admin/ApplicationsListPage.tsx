import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { DataNotFound } from "../../core/components/DataNotFound";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { ApiQueryParams } from "../../core/lib/api";
import { useAppDispatch } from "../../store";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { ApplicationsTable } from "./components/ApplicationManagement/ApplicationsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadServerApplications } from "./state/applications/actions";
import { PlusOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const ApplicationsListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.serverApplications
  );
  const [search, setSearch] = useState<string>(null);
  const queryParams: ApiQueryParams = { search, order: "DESC", sortBy: "createdAt" };

  useEffect(() => {
    fetchApplications();
  }, [search]);

  const fetchApplications = () => {
    dispatch(loadServerApplications(queryParams));
  };

  const onNewApp = () => {
    navigate("/dashboard/new-app");
    dispatch(hideNavbar(true));
  };

  return (
    <DashboardPageWrapper>
      <Card
        title="Applications list"
        extra={
          <Button onClick={() => onNewApp()} icon={<PlusOutlined />}>
            New aplication
          </Button>
        }
      >
        <SearchWrapper className="pb-5">
          <InputSearch
            placeholder="Search application by name"
            value={search}
            onChange={setSearch}
          />
        </SearchWrapper>
        <ConditionalWrapper
          isEmpty={applications?.length === 0}
          isLoading={!hasFetched}
          emptyView={<DataNotFound label="Applications not found. Create first one!" />}
        >
          <ApplicationsTable applications={applications} hasFetched={hasFetched} />
        </ConditionalWrapper>
      </Card>
    </DashboardPageWrapper>
  );
};

export default ApplicationsListPage;
