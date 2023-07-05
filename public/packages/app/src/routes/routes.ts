import NotFound from "../core/components/Layout/Pages/NotFound";
import { RouteDescriptor } from "../core/types/navigation";
import Login from "../features/auth/login";
import { lazy } from "react";
import ProjectDashboardWrapper from "../core/components/Layout/Wrappers/ProjectDashboardWrapper";

const getPublicRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/",
      component: Login
    },
    {
      path: "*",
      component: NotFound
    },
    {
      path: "not-found",
      component: NotFound
    }
  ];
};

const getDashboardRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/dashboard/projects",
      component: lazy(() => import("../features/dashboard/ProjectsListPage"))
    },
    {
      path: "/dashboard/new-project",
      component: lazy(() => import("../features/admin/CreateProjectPage"))
    },
    {
      path: "/dashboard/new-user",
      component: lazy(() => import("../features/admin/CreateUserPage"))
    },
    {
      path: "/dashboard/admin/users",
      component: lazy(() => import("../features/admin/UsersListPage"))
    },
    {
      path: "/dashboard/admin/users/:id",
      component: lazy(() => import("../features/admin/UserPage"))
    },
    {
      path: "/dashboard/admin/apps",
      component: lazy(() => import("../features/admin/ProjectsListPage"))
    },
    {
      path: "/dashboard/admin/apps/:id",
      component: lazy(() => import("../features/admin/ProjectPage"))
    },
    {
      path: "/dashboard/admin/instance",
      component: lazy(() => import("../features/admin/InstancePage"))
    },
    {
      path: "/dashboard/profile/settings",
      component: lazy(() => import("../features/profile/UserProfilePage"))
    }
  ];
};

const getApplicationRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/project/:id/dashboard/:dashboardId",
      component: lazy(() => import("../features/project/overview/DashboardPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/dashboard-create",
      component: lazy(() => import("../features/project/overview/CreateDashboardPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/dashboard/:dashboardId/edit",
      component: lazy(() => import("../features/project/overview/EditDashboardPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/dashboard/:dashboardId/panel-create",
      component: lazy(() => import("../features/project/overview/CreatePanelPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/dashboard/:dashboardId/panel/:panelId",
      component: lazy(() => import("../features/project/overview/PanelPreviewPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents",
      component: lazy(() => import("../features/project/incidents/IncidentsListPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:incidentId/details",
      component: lazy(() => import("../features/project/incidents/IncidentDetailsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:incidentId/analytics",
      component: lazy(() => import("../features/project/incidents/IncidentAnalyticsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:incidentId/events",
      component: lazy(() => import("../features/project/incidents/IncidentEventsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/performance",
      component: lazy(() => import("../features/project/performance/PerformancePage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/performance/:name",
      component: lazy(() => import("../features/project/performance/vitals/VitalsPreviewPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/explore",
      component: lazy(() => import("../features/project/explore/ExplorePage")),
      wrapper: ProjectDashboardWrapper
    },
    // {
    //   path: "/project/:id/explore/tracing",
    //   component: lazy(() => import("../features/project/explore/tracing/TracesPage")),
    //   wrapper: ProjectDashboardWrapper
    // },
    // {
    //   path: "/project/:id/alerting",
    //   component: lazy(() => import("../features/project/alerting/AlertsListPage")),
    //   wrapper: ProjectDashboardWrapper
    // },
    // {
    //   path: "/project/:id/alerting/:aid/details",
    //   component: lazy(() => import("../features/project/alerting/AlertPreviewPage")),
    //   wrapper: ProjectDashboardWrapper
    // },
    // {
    //   path: "/project/:id/alerting/:aid/history",
    //   component: lazy(() => import("../features/project/alerting/AlertHistoryPage")),
    //   wrapper: ProjectDashboardWrapper
    // },
    // {
    //   path: "/project/:id/alerting/:aid/edit",
    //   component: lazy(() => import("../features/project/alerting/EditAlertPage")),
    //   wrapper: ProjectDashboardWrapper
    // },
    // {
    //   path: "/project/:id/alerting/create",
    //   component: lazy(() => import("../features/project/alerting/CreateAlertPage")),
    //   wrapper: ProjectDashboardWrapper
    // },
    {
      path: "/project/:id/settings/access",
      component: lazy(() => import("../features/project/settings/MembersListPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/settings/details",
      component: lazy(() => import("../features/project/settings/SettingsDetailsPage")),
      wrapper: ProjectDashboardWrapper
    }
  ];
};

export const getAppRoutes = (): RouteDescriptor[] => {
  return [...getPublicRoutes(), ...getDashboardRoutes(), ...getApplicationRoutes()];
};
