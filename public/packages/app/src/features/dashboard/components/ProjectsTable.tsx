import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { SortIcons } from "../../../core/components/SortIcons";
import { useUser } from "../../../core/hooks/useUser";
import { useAppDispatch } from "../../../store";
import { loadProjects } from "../state/actions";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectsList } from "./EmptyProjectsList";
import { StoreState } from "@store/types";
import { SortOrder, SearchProjectQueryParams } from "@traceo/types";
import { InputSearch, Select } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const dispatch = useAppDispatch();
  const { projects, hasFetched } = useSelector((state: StoreState) => state.projects);
  const user = useUser();

  const [order, setOrder] = useState<SortOrder>("DESC");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_ERROR);

  const fetchApplications = () => {
    const queryParams: SearchProjectQueryParams = {
      order,
      sortBy,
      search: search,
      userId: user?.id
    };
    dispatch(loadProjects(queryParams));
  };

  useEffect(() => fetchApplications(), [order, sortBy, search]);

  return (
    <div>
      <SearchWrapper>
        <InputSearch placeholder="Search by name" value={search} onChange={setSearch} />
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
        isLoading={!hasFetched}
        isEmpty={projects?.length === 0}
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
