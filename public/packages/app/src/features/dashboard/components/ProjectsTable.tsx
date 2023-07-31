import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { SortIcons } from "../../../core/components/SortIcons";
import { useUser } from "../../../core/hooks/useUser";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectsList } from "./EmptyProjectsList";
import { SortOrder, MemberProject } from "@traceo/types";
import { InputSearch, Select } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useReactQuery } from "../../../core/hooks/useReactQuery";

export enum AppsSortBy {
  LAST_UPDATE = "updatedAt",
  CREATED_AT = "createdAt",
  LAST_ERROR = "lastEventAt"
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

export const ProjectsTable = () => {
  const user = useUser();

  const [order, setOrder] = useState<SortOrder>("DESC");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_ERROR);

  const {
    data: projects = [],
    isLoading,
    isRefetching,
    refetch
  } = useReactQuery<MemberProject[]>({
    queryKey: ["projects"],
    url: "/api/member/projects",
    params: { order, sortBy, search: search, userId: user.id }
  });

  const hasProjects = projects && projects.length > 0;

  useEffect(() => {
    refetch();
  }, [order, sortBy, search]);

  return (
    <div>
      <SearchWrapper>
        <InputSearch
          placeholder="Search by name"
          value={search}
          onChange={setSearch}
          loading={isRefetching}
        />
        <Select
          width={150}
          options={sortOptions}
          value={sortBy}
          onChange={(opt) => setSortBy(opt?.value)}
          isClearable
        />
        <SortIcons order={order} setOrder={setOrder} />
      </SearchWrapper>
      <ConditionalWrapper
        isLoading={isLoading}
        isEmpty={!hasProjects}
        emptyView={<EmptyProjectsList constraints={search} />}
      >
        <div className="grid grid-cols-12 pt-5">
          {projects?.map((project, index) => (
            <ProjectCard project={project} key={index} />
          ))}
        </div>
      </ConditionalWrapper>
    </div>
  );
};
