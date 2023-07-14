import { Dashboard, IProject, MemberRole } from "@traceo/types";

/**
 * Base type for withProject HOC
 */
export type BaseProjectViewType = {
  project: IProject;
  permission: MemberRole;
  children: JSX.Element;
};

/**
 * Base type for withDashboard HOC
 */
export type BaseDashboardViewType = {
  dashboard: Dashboard;
};

export type ProjectDashboardViewType = BaseProjectViewType & BaseDashboardViewType;
