import { Page } from "../../../core/components/Page";
import { MenuRoute } from "../../../core/types/navigation";
import { DeploymentUnitOutlined, AlignLeftOutlined, CompassOutlined } from "@ant-design/icons";
import { FC } from "react";

export const ExplorePageWrapper: FC = ({ children }) => {
  const menu: MenuRoute[] = [
    {
      href: "/project/:id/explore/logs",
      label: "Logs",
      key: "logs",
      icon: <AlignLeftOutlined />
    },
    {
      href: "/project/:id/explore/runtime",
      label: "Runtime configuration",
      key: "runtime",
      icon: <DeploymentUnitOutlined />
    }
  ];

  return (
    <Page
      header={{
        icon: <CompassOutlined />,
        title: "Explore",
        description: "Explore informations about this app"
      }}
      menuRoutes={menu}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

export default ExplorePageWrapper;
