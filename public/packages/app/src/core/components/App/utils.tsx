import { NavItem } from "@traceo/types";
import { toTitleCase } from "@traceo/ui";
import { urlService } from "src/core/lib/url";

const removeQueryParamsFromPathname = (pathname: string) => {
  const indexOfQueryParams = pathname.indexOf("?");

  if (indexOfQueryParams !== -1) {
    const newPath = pathname.substr(0, indexOfQueryParams);
    return newPath;
  }

  return pathname;
};

/**
 * TODO: rewrite this...
 *
 * @returns tree of navItems
 */
export const getActiveRoute = (navTree: NavItem[], pathname: string) => {
  let mainItem: NavItem = undefined;
  let subItem: NavItem = undefined;

  const pathWithoutParams = removeQueryParamsFromPathname(pathname);
  const pathSplits = pathname.split("/");

  for (const node of navTree) {
    const nodePath = removeQueryParamsFromPathname(node.url);
    if (nodePath === pathWithoutParams) {
      mainItem = node;
    }

    for (const nestedNode of node.items) {
      if (nestedNode.url === pathWithoutParams) {
        mainItem = node;
        subItem = nestedNode;
      }
    }
  }

  if (!mainItem) {
    if (pathSplits[1] === "project") {
      const page = pathSplits[3];
      const dashboardNode = navTree.find((e) => e.id === "dashboards");

      switch (page) {
        case "incidents":
          mainItem = navTree.find((e) => e.id === "incidents");
          const label = pathSplits[5];
          subItem = {
            id: "incident_details",
            label: toTitleCase(label)
          };
          break;
        case "dashboard-create":
          mainItem = dashboardNode;
          subItem = {
            id: "dashboard_create",
            label: "New dashboard"
          };
          break;
        case "dashboard":
          const dashAction = pathSplits[5];
          if (dashAction === "panel") {
            mainItem = dashboardNode;
            subItem = {
              id: "dashboard_panel",
              label: "Panel"
            };
          } else if (dashAction === "panel-create") {
            mainItem = dashboardNode;
            subItem = {
              id: "dashboard_create_panel",
              label: "Create panel"
            };
          } else if (dashAction === "edit") {
            mainItem = dashboardNode;
            subItem = {
              id: "dashboard_edit",
              label: "Edit"
            };
          }

          break;
        case "performance":
          mainItem = navTree.find((e) => e.id === "performance");
          const perfType = pathSplits[4];
          subItem = {
            id: "performance_preview",
            label: perfType
          };
          break;
        default:
          break;
      }
    }

    if (pathSplits[2] === "admin") {
      mainItem = navTree.find((e) => e.id === "admin_panel");
      subItem = {
        id: "admin_details",
        label: pathSplits[4]
      };
    }

    if (pathSplits[2] === "new-project") {
      mainItem = navTree.find((e) => e.id === "overview");
      subItem = {
        id: "new_project",
        label: "New project"
      };
    }

    if (pathSplits[2] === "new-user") {
      mainItem = navTree.find((e) => e.id === "overview");
      subItem = {
        id: "new_user",
        label: "New user"
      };
    }
  }

  // guard to back to current selected dashboard
  if (mainItem?.id === "dashboards") {
    mainItem = {
      ...mainItem,
      url: `/project/${pathSplits[2]}/dashboard/${pathSplits[4]}`
    };
  }

  return {
    mainItem,
    subItem
  };
};
