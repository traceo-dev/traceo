import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { DataNotFound } from "../../core/components/DataNotFound";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { AdminProjectsTable } from "./components/ApplicationManagement/AdminProjectsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { PlusOutlined } from "@ant-design/icons";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useState } from "react";
import { useReactQuery } from "../../core/hooks/useReactQuery";
import { IProject } from "@traceo/types";
import { RouterLink } from "../../core/components/RouterLink";

export const ProjectsListPage = () => {
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

  return (
    <DashboardPageWrapper>
      <Card
        title="Projects list"
        extra={
          <RouterLink to={"/dashboard/new-project"}>
            <Button size="sm" icon={<PlusOutlined />}>
              New aplication
            </Button>
          </RouterLink>
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
