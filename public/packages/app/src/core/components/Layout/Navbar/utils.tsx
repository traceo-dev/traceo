import {
  BarChartOutlined,
  BugOutlined,
  CompassOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { IApplication, SDK, ViewConfigData } from "@traceo/types";
import { Avatar } from "@traceo/ui";
import { MenuRoute } from "src/core/types/navigation";

const BROWSER_SDKS = [SDK.REACT];

export const buildAppNavbar = (application: IApplication): MenuRoute[] => {
  const sdk = application.sdk;

  const navItems: MenuRoute[] = [
    {
      key: "incidents",
      href: "/app/:id/incidents",
      label: "Incidents",
      icon: <BugOutlined />
    }
  ];

  if (!BROWSER_SDKS.includes(sdk)) {
    navItems.splice(2, 0, {
      key: "explore",
      href: "/app/:id/explore/logs",
      label: "Explore",
      icon: <CompassOutlined />
    });

    navItems.splice(3, 0, {
      key: "metrics",
      href: "/app/:id/metrics",
      label: "Metrics",
      icon: <BarChartOutlined />
    });
  }

  return navItems;
};
