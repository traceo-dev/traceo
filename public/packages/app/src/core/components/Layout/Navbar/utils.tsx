import {
  AlertOutlined,
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
import { conditionClass, joinClasses } from "src/core/utils/classes";

const BROWSER_SDKS = [SDK.REACT];

export const buildAppNavbar = (application: IApplication): MenuRoute[] => {
  const sdk = application.sdk;

  const navItems: MenuRoute[] = [
    {
      key: "incidents",
      href: "/app/:id/incidents",
      label: "Incidents",
      badge: (
        <div
          className={joinClasses(
            "text-black text-xs border rounded-full px-2 font-semibold",
            conditionClass(application.incidentsCount > 0, "bg-yellow-600", "bg-green-600")
          )}
        >
          {application.incidentsCount}
        </div>
      ),
      icon: <AlertOutlined />
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
