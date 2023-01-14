import PublicPageWrapper from "core/components/Layout/Wrappers/PublicPageWrapper";
import { lazy } from "react";
import NotFound from "../core/components/Layout/Pages/NotFound";
import Login from "../features/auth/login";
import { RouteDescriptor } from "../types/navigation";

const getPublicRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/",
      component: Login,
      wrapper: PublicPageWrapper
    },
    {
      path: "*",
      component: NotFound
    }
  ];
};

const getDashboardRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/dashboard/overview",
      component: lazy(() => import("../features/dashboard/Dashboard"))
    },
    {
      path: "/dashboard/management/accounts",
      component: lazy(() => import("../features/management/ManagementUsersPage"))
    },
    {
      path: "/dashboard/management/accounts/:id",
      component: lazy(() => import("../features/management/ManagementUserPage"))
    },
    {
      path: "/dashboard/management/apps",
      component: lazy(() => import("../features/management/ManagementApplicationsPage"))
    },
    {
      path: "/dashboard/management/apps/:id",
      component: lazy(() => import("../features/management/ManagementApplicationPage"))
    },
    {
      path: "/dashboard/management/instance",
      component: lazy(() => import("../features/management/ManagementInstancePage"))
    },
    {
      path: "/dashboard/updates",
      component: lazy(() => import("../features/updates/UpdatePage"))
    },
    {
      path: "/dashboard/account/settings",
      component: lazy(() => import("../features/settings/SettingsAccountPage"))
    },
    {
      path: "/dashboard/account/notifications",
      component: lazy(() => import("../features/settings/SettingsNotificationsPage"))
    }
  ];
};

const getApplicationRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/app/:id/overview",
      component: lazy(() => import("../features/app/overview/AppOverviewPage"))
    },
    {
      path: "/app/:id/incidents",
      component: lazy(() => import("../features/app/incidents/AppIncidentsListPage"))
    },
    {
      path: "/app/:id/incidents/:iid/details",
      component: lazy(() => import("../features/app/incidents/AppIncidentDetailsPage"))
    },
    {
      path: "/app/:id/incidents/:iid/analytics",
      component: lazy(() => import("../features/app/incidents/AppIncidentAnalyticsPage"))
    },
    {
      path: "/app/:id/incidents/:iid/conversation",
      component: lazy(
        () => import("../features/app/incidents/AppIncidentConversationPage")
      )
    },
    {
      path: "/app/:id/explore/runtime",
      component: lazy(() => import("../features/app/explore/runtime/AppRuntimePage"))
    },
    {
      path: "/app/:id/explore/logs",
      component: lazy(() => import("../features/app/explore/logs/AppLogsPage"))
    },
    {
      path: "/app/:id/metrics",
      component: lazy(() => import("../features/app/metrics/MetricsPage"))
    },
    {
      path: "/app/:id/metrics/preview/:metricId",
      component: lazy(() => import("../features/app/metrics/MetricPreviewPage"))
    },
    {
      path: "/app/:id/settings/access",
      component: lazy(() => import("../features/app/settings/AppMembersListPage"))
    },
    {
      path: "/app/:id/settings/details",
      component: lazy(() => import("../features/app/settings/AppSettingsDetailsPage"))
    },
    {
      path: "/app/:id/settings/datasource",
      component: lazy(() => import("../features/app/settings/AppSettingsDataSourcePage"))
    }
  ];
};

export const getAppRoutes = (): RouteDescriptor[] => {
  return [...getPublicRoutes(), ...getDashboardRoutes(), ...getApplicationRoutes()];
};
