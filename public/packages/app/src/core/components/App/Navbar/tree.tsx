import {
  AppstoreFilled,
  AppstoreOutlined,
  BugOutlined,
  CompassOutlined,
  HomeOutlined,
  PlusOutlined,
  RocketOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dashboard, IProject, IUser, MemberRole, SDK } from "@traceo/types";
import { NavItem } from "./types";

interface TreeProps {
  user: IUser;
  project: IProject;
  dashboards: Dashboard[];
  permission: MemberRole;
}
export const buildTree = ({
  dashboards = [],
  project = undefined,
  user = undefined,
  permission = MemberRole.NONE
}: TreeProps): NavItem[] => {
  const treeRoot: NavItem[] = [];
  console.log("user: ", user);

  if (project.id) {
    const isProjectAdmin = permission === MemberRole.ADMINISTRATOR;
    const isProjectMaintainer = permission === MemberRole.MAINTAINER;
    const isFrontendProject = [SDK.REACT, SDK.VUE].includes(project.sdk);

    const dashboardRoot: NavItem = {
      id: "dashboards",
      label: "Dashboards",
      icon: <AppstoreFilled />,
      subtitle: undefined,
      url: `/project/${project.id}/dashboard/${project.mainDashboardId}`,
      items: []
    };

    if ([MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(permission)) {
      dashboardRoot.items.push({
        id: "new_dashboard",
        label: "New dashboard",
        icon: <PlusOutlined />,
        url: `/project/${project.id}/dashboard-create`
      });
    }

    for (const dashboard of dashboards) {
      dashboardRoot.items.push({
        id: `dashboard_${dashboard.id}`,
        label: dashboard.name,
        icon: undefined,
        subtitle: undefined,
        url: `/project/${project.id}/dashboard/${dashboard.id}`
      });
    }

    treeRoot.push(dashboardRoot);

    treeRoot.push({
      id: "incidents",
      label: "Incidents",
      icon: <BugOutlined />,
      url: `/project/${project.id}/incidents`,
      items: []
    });

    if (!isFrontendProject) {
      const exploreRoot: NavItem = {
        id: "explore",
        label: "Explore",
        icon: <CompassOutlined />,
        subtitle: undefined,
        url: `/project/${project.id}/explore?type=logs`,
        items: []
      };

      exploreRoot.items.push({
        id: "explore_logs",
        label: "Logs",
        icon: undefined,
        subtitle: undefined,
        url: `/project/${project.id}/explore?type=logs`
      });

      exploreRoot.items.push({
        id: "explore_metrics",
        label: "Metrics",
        icon: undefined,
        subtitle: undefined,
        url: `/project/${project.id}/explore?type=metrics`
      });

      exploreRoot.items.push({
        id: "explore_spans",
        label: "Spans",
        icon: undefined,
        subtitle: undefined,
        url: `/project/${project.id}/explore?type=spans`
      });

      treeRoot.push(exploreRoot);
    }

    if (isFrontendProject) {
      treeRoot.push({
        id: "performance",
        label: "Performance",
        icon: <RocketOutlined />,
        items: [],
        subtitle: undefined,
        url: `/project/${project.id}/performance`
      });
    }

    const settingsRoot: NavItem = {
      id: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      subtitle: undefined,
      url: `/project/${project.id}/settings/details`,
      items: []
    };

    settingsRoot.items.push({
      id: "settings_details",
      label: "Details",
      icon: undefined,
      subtitle: undefined,
      url: `/project/${project.id}/settings/details`
    });

    settingsRoot.items.push({
      id: "settings_access",
      label: "Access",
      icon: undefined,
      subtitle: undefined,
      url: `/project/${project.id}/settings/access`
    });

    treeRoot.push(settingsRoot);
  } else {
    treeRoot.push({
      id: "overview",
      label: "Overview",
      icon: <AppstoreOutlined />,
      items: [],
      subtitle: undefined,
      url: `/dashboard/projects`
    });
  }

  if (user.admin) {
    const adminPanelRoot: NavItem = {
      id: "admin_panel",
      label: "Administration",
      icon: <HomeOutlined />,
      subtitle: undefined,
      url: `/dashboard/admin/users`,
      items: []
    };

    adminPanelRoot.items.push({
      id: "admin_panel_users",
      label: "Users",
      icon: undefined,
      subtitle: undefined,
      url: `/dashboard/admin/users`
    });

    adminPanelRoot.items.push({
      id: "admin_panel_projects",
      label: "Projects",
      icon: undefined,
      subtitle: undefined,
      url: `/dashboard/admin/apps`
    });

    adminPanelRoot.items.push({
      id: "admin_panel_instance_info",
      label: "Instance Info",
      icon: undefined,
      subtitle: undefined,
      url: `/dashboard/admin/instance`
    });

    treeRoot.push(adminPanelRoot);
  }

  const profileRoot: NavItem = {
    id: "profile",
    label: "Profile",
    icon: <UserOutlined />,
    subtitle: undefined,
    url: "/dashboard/profile/settings",
    items: []
  };

  profileRoot.items.push({
    id: "profile_settings",
    label: "Settings",
    icon: undefined,
    subtitle: undefined,
    url: "/dashboard/profile/settings"
  });

  treeRoot.push(profileRoot);

  return treeRoot;
};
