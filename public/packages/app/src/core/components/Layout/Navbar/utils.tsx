import { AlertOutlined, BarChartOutlined, CompassOutlined } from "@ant-design/icons";
import { IApplication, SDK } from "@traceo/types";
import { MenuRoute } from "../../../../core/types/navigation";

const BROWSER_SDKS = [SDK.REACT];

export const buildAppNavbar = (application: IApplication): MenuRoute[] => {
  const sdk = application.sdk;

  const navItems: MenuRoute[] = [
    {
      key: "incidents",
      href: "/app/:id/incidents",
      label: "Incidents",
      badge: application.incidentsCount > 0 && (
        <div className="text-black text-xs border rounded-full px-2 font-semibold bg-yellow-600">
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
