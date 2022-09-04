import { lazy } from "react";
import NotFound from "src/core/components/Layout/Pages/404";
import ConfirmAccount from "src/features/auth/confirm";
import Invite from "src/features/auth/invite";
import Login from "src/features/auth/login";
import SignUp from "src/features/auth/signup";
import LandingPage from "src/features/landing/LandingPage";
import { RouteDescriptor } from "src/types/navigation";

const getPublicRoutes = (): RouteDescriptor[] => {
  return [
    {
      path: "/",
      component: LandingPage
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/signUp",
      component: SignUp
    },
    {
      path: "/confirm",
      component: ConfirmAccount
    },
    {
      path: "/invite",
      component: Invite
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
      path: "/app/:id/:slug/members",
      component: lazy(() => import("../features/app/members/AppMembersListPage"))
    },
    {
      path: "/app/:id/:slug/settings/details",
      component: lazy(() => import("../features/app/settings/AppSettingsDetailsPage"))
    },
    {
      path: "/app/:id/:slug/settings/credentials",
      component: lazy(() => import("../features/app/settings/AppSettingsCredentialsPage"))
    }
  ];
};

export const getAppRoutes = (): RouteDescriptor[] => {
  return [...getPublicRoutes(), ...getDashboardRoutes(), ...getApplicationRoutes()];
};