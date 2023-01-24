import { PageHeader, PageHeaderProps } from "core/ui-components/PageHeader";
import { FC } from "react";
import styled from "styled-components";
import { MenuRoute } from "types/navigation";
import { Menu } from "./Layout/Menu";
import { PageContent } from "./PageContent";
import { TraceoLoading } from "./TraceoLoading";

const ScrollbarView = styled.div`
  position: relative;
  overflow: scroll;
  overflow-x: hidden;
  display: flex;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`;

const ScrollbarContent = styled.div`
  display: block;
  min-height: 100%;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

interface PageProps {
  menuRoutes?: MenuRoute[];
  header?: PageHeaderProps;
  isLoading?: boolean;
}

interface PageType extends FC<PageProps> {
  Content: typeof PageContent;
}

export const Page: PageType = ({ children, menuRoutes, header, isLoading }) => {
  return (
    <ScrollbarView>
      <ScrollbarContent>
        {!isLoading && (
          <div className="px-6 py-9">
            {header && <PageHeader {...header} />}
            {menuRoutes && <Menu routes={menuRoutes} />}
            {children}
          </div>
        )}

        {isLoading && <TraceoLoading />}
      </ScrollbarContent>
    </ScrollbarView>
  );
};

Page.Content = PageContent;
