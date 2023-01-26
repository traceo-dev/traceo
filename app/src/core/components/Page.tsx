import { PageHeader, PageHeaderProps } from "core/ui-components/PageHeader";
import { FC } from "react";
import styled from "styled-components";
import { MenuRoute } from "types/navigation";
import { Menu } from "./Layout/Menu";
import { PageCenter } from "./PageCenter";
import { PageContent } from "./PageContent";
import { TraceoLoading } from "./TraceoLoading";

interface PageProps {
  menuRoutes?: MenuRoute[];
  header?: PageHeaderProps;
  isLoading?: boolean;
}

interface PageType extends FC<PageProps> {
  Content: typeof PageContent;
}

export const Page: PageType = ({ children, menuRoutes, header, isLoading }) => {
  if (isLoading) {
    return (
      <PageCenter>
        <TraceoLoading />
      </PageCenter>
    );
  }
  return (
    <div className="px-6 py-9">
      {header && <PageHeader {...header} />}
      {menuRoutes && <Menu routes={menuRoutes} />}
      {children}
    </div>
  );
};

Page.Content = PageContent;
