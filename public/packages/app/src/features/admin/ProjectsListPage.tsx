import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { DataNotFound } from "../../core/components/DataNotFound";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { ApiQueryParams } from "../../core/lib/api";
import { useAppDispatch } from "../../store";
import { AdminProjectsTable } from "./components/ApplicationManagement/AdminProjectsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadInstanceProjects } from "./state/projects/actions";
import { PlusOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const ProjectsListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, hasFetched } = useSelector((state: StoreState) => state.instanceApplications);
  const [search, setSearch] = useState<string>(null);
  const queryParams: ApiQueryParams = { search, order: "DESC", sortBy: "createdAt" };

  useEffect(() => {
    fetchApplications();
  }, [search]);

  const fetchApplications = () => {
    dispatch(loadInstanceProjects(queryParams));
  };

  const onNewApp = () => navigate("/dashboard/new-project");

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
            placeholder="Search project by name"
            value={search}
            onChange={setSearch}
          />
        </SearchWrapper>
        <ConditionalWrapper
          isEmpty={projects?.length === 0}
          isLoading={!hasFetched}
          emptyView={<DataNotFound label="Applications not found. Create first one!" />}
        >
          <AdminProjectsTable projects={projects} hasFetched={hasFetched} />
        </ConditionalWrapper>
      </Card>
    </DashboardPageWrapper>
  );
};

export default ProjectsListPage;
