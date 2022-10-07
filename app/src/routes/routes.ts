import { lazy } from "react";
import NotFound from "../core/components/Layout/Pages/404";
import Login from "../features/auth/login";
import { RouteDescriptor } from "../types/navigation";

const getPublicRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/404",
      component: NotFound
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
      path: "/app/:id/:slug/overview",
      component: lazy(() => import("../features/app/overview/AppOverviewPage"))
    },
    {
      path: "/app/:id/:slug/incidents",
      component: lazy(() => import("../features/app/incidents/AppIncidentsListPage"))
    },
    {
      path: "/app/:id/:slug/incidents/:iid/details",
      component: lazy(() => import("../features/app/incidents/AppIncidentDetailsPage"))
    },
    {
      path: "/app/:id/:slug/incidents/:iid/analytics",
      component: lazy(() => import("../features/app/incidents/AppIncidentAnalyticsPage"))
    },
    {
      path: "/app/:id/:slug/incidents/:iid/conversation",
      component: lazy(
        () => import("../features/app/incidents/AppIncidentConversationPage")
      )
    },
    {
      path: "/app/:id/:slug/explore/runtime",
      component: lazy(() => import("../features/app/explore/runtime/AppRuntimePage"))
    },
    {
      path: "/app/:id/:slug/explore/logs",
      component: lazy(() => import("../features/app/explore/logs/AppLogsPage"))
    },
    {
      path: "/app/:id/:slug/metrics",
      component: lazy(() => import("../features/app/metrics/MetricsPage"))
    },
    {
      path: "/app/:id/:slug/members",
      component: lazy(() => import("../features/app/members/AppMembersListPage"))
    },
    {
      path: "/app/:id/:slug/settings/details",
      component: lazy(() => import("../features/app/settings/AppSettingsDetailsPage"))
    },
    {
      path: "/app/:id/:slug/settings/datasource",
      component: lazy(() => import("../features/app/settings/AppSettingsDataSourcePage"))
    }
  ];
};

export const getAppRoutes = (): RouteDescriptor[] => {
  return [...getPublicRoutes(), ...getDashboardRoutes(), ...getApplicationRoutes()];
};
