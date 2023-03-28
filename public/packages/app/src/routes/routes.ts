import NotFound from "../core/components/Layout/Pages/NotFound";
import { RouteDescriptor } from "../core/types/navigation";
import Login from "../features/auth/login";
import { lazy } from "react";
import AppDashboardPage from "src/core/components/Layout/Wrappers/AppDashboardWrapper";

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
      path: "/dashboard/applications",
      component: lazy(() => import("../features/dashboard/ApplicationsPage"))
    },
    {
      path: "/dashboard/new-app",
      component: lazy(() => import("../features/dashboard/CreateApplicationPage"))
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
      component: lazy(() => import("../features/admin/ApplicationsListPage"))
    },
    {
      path: "/dashboard/admin/apps/:id",
      component: lazy(() => import("../features/admin/ApplicationPage"))
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
      component: lazy(() => import("../features/app/overview/AppOverviewPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/incidents",
      component: lazy(() => import("../features/app/incidents/IncidentsListPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/incidents/:iid/details",
      component: lazy(() => import("../features/app/incidents/IncidentDetailsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/incidents/:iid/analytics",
      component: lazy(() => import("../features/app/incidents/IncidentAnalyticsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/incidents/:iid/events",
      component: lazy(() => import("../features/app/incidents/IncidentEventsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/incidents/:iid/conversation",
      component: lazy(() => import("../features/app/incidents/IncidentConversationPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/explore/runtime",
      component: lazy(() => import("../features/app/explore/RuntimePage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/explore/logs",
      component: lazy(() => import("../features/app/explore/LogsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/metrics",
      component: lazy(() => import("../features/app/metrics/MetricsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/metrics/preview/:metricId",
      component: lazy(() => import("../features/app/metrics/MetricPreviewPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/settings/access",
      component: lazy(() => import("../features/app/settings/AppMembersListPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/project/:id/settings/details",
      component: lazy(() => import("../features/app/settings/AppSettingsDetailsPage")),
      wrapper: AppDashboardPage
    }
  ];
};

export const getAppRoutes = (): RouteDescriptor[] => {
  return [...getPublicRoutes(), ...getDashboardRoutes(), ...getApplicationRoutes()];
};
