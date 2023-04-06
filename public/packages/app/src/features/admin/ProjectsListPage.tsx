import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { DataNotFound } from "../../core/components/DataNotFound";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { AdminProjectsTable } from "./components/ApplicationManagement/AdminProjectsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { PlusOutlined } from "@ant-design/icons";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactQuery } from "../../core/hooks/useReactQuery";
import { IProject } from "@traceo/types";

export const ProjectsListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>(null);

  const {
    data: projects = [],
    isLoading,
    isRefetching
  } = useReactQuery<IProject[]>({
    queryKey: ["projects", search],
    url: "/api/projects/search",
    params: { search, order: "DESC", sortBy: "createdAt" }
  });

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
            loading={isRefetching}
          />
        </SearchWrapper>
        <ConditionalWrapper
          isEmpty={projects?.length === 0}
          isLoading={isLoading}
          emptyView={<DataNotFound label="Applications not found. Create first one!" />}
        >
          <AdminProjectsTable projects={projects} isLoading={isLoading} />
        </ConditionalWrapper>
      </Card>
    </DashboardPageWrapper>
  );
};

export default ProjectsListPage;
