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
      path: "/project/:id/overview",
      component: lazy(() => import("../features/project/overview/OverviewPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents",
      component: lazy(() => import("../features/project/incidents/IncidentsListPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:iid/details",
      component: lazy(() => import("../features/project/incidents/IncidentDetailsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:iid/analytics",
      component: lazy(() => import("../features/project/incidents/IncidentAnalyticsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:iid/events",
      component: lazy(() => import("../features/project/incidents/IncidentEventsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/incidents/:iid/conversation",
      component: lazy(() => import("../features/project/incidents/IncidentConversationPage")),
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
      path: "/project/:id/explore/runtime",
      component: lazy(() => import("../features/project/explore/ConfigurationPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/explore/logs",
      component: lazy(() => import("../features/project/explore/LogsPage")),
      wrapper: ProjectDashboardWrapper
    },
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
      path: "/project/:id/metrics",
      component: lazy(() => import("../features/project/metrics/MetricsPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/metrics/create",
      component: lazy(() => import("../features/project/metrics/CreateMetricPage")),
      wrapper: ProjectDashboardWrapper
    },
    {
      path: "/project/:id/metrics/preview/:metricId",
      component: lazy(() => import("../features/project/metrics/MetricPreviewPage")),
      wrapper: ProjectDashboardWrapper
    },
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
