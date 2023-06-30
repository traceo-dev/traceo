import { IProject, BROWSER_SDK } from "@traceo/types";
import { MenuRoute } from "../../../../core/types/navigation";

export const buildHeaderItems = (isAdmin: boolean, project: IProject): MenuRoute[] => {
  const isProject = window.location.pathname.split("/").includes("project");

  if (isProject && !project) {
    return [];
  }

  if (isProject) {
    const sdk = project.sdk;

    const navItems: MenuRoute[] = [
      {
        key: "dashboard",
        href: "/project/:id/dashboard/:did",
        label: "Dashboard"
      },
      {
        key: "incidents",
        href: "/project/:id/incidents",
        label: "Incidents"
      },
      // {
      //   key: "alerting",
      //   href: "/project/:id/alerting",
      //   label: "Alerting"
      // },
      {
        key: "settings",
        href: "/project/:id/settings/details",
        label: "Settings"
      }
    ];

    if (!BROWSER_SDK.includes(sdk)) {
      navItems.splice(2, 0, {
        key: "explore",
        href: "/project/:id/explore?type=logs",
        label: "Explore"
      });

      navItems.splice(3, 0, {
        key: "metrics",
        href: "/project/:id/metrics",
        label: "Metrics"
      });
    } else {
      navItems.splice(2, 0, {
        key: "performance",
        href: "/project/:id/performance",
        label: "Performance"
      });
    }

    return navItems;
  }

  const navItems: MenuRoute[] = [
    {
      key: "projects",
      label: "Overview",
      href: "/dashboard/projects"
    },

    {
      key: "profile",
      label: "Profile",
      href: "/dashboard/profile/settings"
    }
  ];

  if (isAdmin) {
    navItems.splice(1, 0, {
      key: "admin",
      label: "Admin panel",
      href: "/dashboard/admin/users"
    });
  }

  return navItems;
};
