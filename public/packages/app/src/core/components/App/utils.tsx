import { NavItem } from "@traceo/types";
import { toTitleCase } from "@traceo/ui";
import { urlService } from "../../core/lib/url";

const removeParams = (pathname: string) => {
  const indexOfQueryParams = pathname.indexOf("?");

  if (indexOfQueryParams !== -1) {
    const newPath = pathname.substr(0, indexOfQueryParams);
    return newPath;
  }

  return pathname;
};

export const getActiveRoute = (navTree: NavItem[], pathname: string) => {
  let mainItem: NavItem = undefined;
  let subItem: NavItem = undefined;

  const pathWithoutParams = removeParams(pathname);
  const pathSplits = pathname.split("/");

  for (const node of navTree) {
    const nodePath = removeParams(node.url);
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
            label: toTitleCase(label)
          };
          break;
        case "dashboard-create":
          mainItem = dashboardNode;
          subItem = {
            label: "New dashboard"
          };
          break;
        case "dashboard":
          const dashAction = pathSplits[5];
          if (dashAction === "panel") {
            mainItem = dashboardNode;
            subItem = {
              label: "Panel"
            };
          } else if (dashAction === "panel-create") {
            mainItem = dashboardNode;
            subItem = {
              label: "Create panel"
            };
          } else if (dashAction === "edit") {
            mainItem = dashboardNode;
            subItem = {
              label: "Edit"
            };
          }

          break;
        case "performance":
          mainItem = navTree.find((e) => e.id === "performance");
          const perfType = pathSplits[4];
          subItem = {
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
        label: pathSplits[4]
      };
    }

    if (pathSplits[2] === "new-project") {
      mainItem = navTree.find((e) => e.id === "overview");
      subItem = {
        label: "New project"
      };
    }

    if (pathSplits[2] === "new-user") {
      mainItem = navTree.find((e) => e.id === "overview");
      subItem = {
        label: "New user"
      };
    }
  }

  // guard to back to current selected dashboard
  if (mainItem?.id === "dashboards") {
    const timestampFrom = urlService.getParam("from");
    const timestampTo = urlService.getParam("to");

    mainItem = {
      ...mainItem,
      url: `/project/${pathSplits[2]}/dashboard/${pathSplits[4]}?from=${timestampFrom}&to=${timestampTo}`
    };
  }

  return {
    mainItem,
    subItem
  };
};
