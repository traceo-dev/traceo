import { IProject, BROWSER_SDK } from "@traceo/types";
import { MenuRoute } from "src/core/types/navigation";

export const buildHeaderItems = (project: IProject): MenuRoute[] => {
  const isProject = window.location.pathname.split("/").includes("project");

  if (isProject && !project) {
    return [];
  }

  if (isProject) {
    const sdk = project.sdk;

    const navItems: MenuRoute[] = [
      {
        key: "overview",
        href: "/project/:id/overview",
        label: "Overview"
      },
      {
        key: "incidents",
        href: "/project/:id/incidents",
        label: "Incidents",
        badge: project.incidentsCount > 0 && (
          <div className="text-black text-xs border rounded-full px-2 font-semibold bg-yellow-600">
            {project.incidentsCount}
          </div>
        )
      },
      {
        key: "settings",
        href: "/project/:id/settings/details",
        label: "Settings"
      }
    ];

    if (!BROWSER_SDK.includes(sdk)) {
      navItems.splice(2, 0, {
        key: "explore",
        href: "/project/:id/explore/logs",
        label: "Explore"
      });

      navItems.splice(3, 0, {
        key: "metrics",
        href: "/project/:id/metrics",
        label: "Metrics"
      });
    }

    return navItems;
  }

  const navItems: MenuRoute[] = [
    {
      key: "applications",
      label: "Overview",
      href: "/dashboard/applications"
    },
    {
      key: "admin",
      label: "Admin panel",
      href: "/dashboard/admin/users"
    },
    {
      key: "profile",
      label: "Profile",
      href: "/dashboard/profile/settings"
    }
  ];

  return navItems;
};
