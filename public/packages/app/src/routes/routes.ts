import AppDashboardPage from "../core/components/Layout/Wrappers/AppDashboardWrapper";
import PublicPageWrapper from "../core/components/Layout/Wrappers/PublicPageWrapper";
import { lazy } from "react";
import NotFound from "../core/components/Layout/Pages/NotFound";
import Login from "../features/auth/login";
import { RouteDescriptor } from "@traceo/types";

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
      path: "/dashboard/overview",
      component: lazy(() => import("../features/dashboard/DashboardPage"))
    },
    {
      path: "/dashboard/app/new",
      component: lazy(() => import("../features/dashboard/CreateApplicationPage"))
    },
    {
      path: "/dashboard/management/accounts",
      component: lazy(() => import("../features/management/UsersListPage"))
    },
    {
      path: "/dashboard/management/accounts/:id",
      component: lazy(() => import("../features/management/UserPage"))
    },
    {
      path: "/dashboard/management/apps",
      component: lazy(() => import("../features/management/ApplicationsListPage"))
    },
    {
      path: "/dashboard/management/apps/:id",
      component: lazy(() => import("../features/management/ApplicationPage"))
    },
    {
      path: "/dashboard/management/instance",
      component: lazy(() => import("../features/management/InstancePage"))
    },
    {
      path: "/dashboard/account/settings",
      component: lazy(() => import("../features/settings/AccountPage"))
    }
  ];
};

const getApplicationRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/app/:id/overview",
      component: lazy(() => import("../features/app/overview/AppOverviewPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/incidents",
      component: lazy(() => import("../features/app/incidents/IncidentsListPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/incidents/:iid/details",
      component: lazy(() => import("../features/app/incidents/IncidentDetailsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/incidents/:iid/analytics",
      component: lazy(() => import("../features/app/incidents/IncidentAnalyticsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/incidents/:iid/conversation",
      component: lazy(
        () => import("../features/app/incidents/IncidentConversationPage"),
      ),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/explore/runtime",
      component: lazy(() => import("../features/app/explore/RuntimePage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/explore/logs",
      component: lazy(() => import("../features/app/explore/LogsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/metrics",
      component: lazy(() => import("../features/app/metrics/MetricsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/metrics/preview/:metricId",
      component: lazy(() => import("../features/app/metrics/MetricPreviewPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/settings/access",
      component: lazy(() => import("../features/app/settings/AppMembersListPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/settings/details",
      component: lazy(() => import("../features/app/settings/AppSettingsDetailsPage")),
      wrapper: AppDashboardPage
    },
    {
      path: "/app/:id/settings/datasource",
      component: lazy(() => import("../features/app/settings/AppSettingsDataSourcePage")),
      wrapper: AppDashboardPage
    }
  ];
};

export const getAppRoutes = (): RouteDescriptor[] => {
  return [...getPublicRoutes(), ...getDashboardRoutes(), ...getApplicationRoutes()];
};
