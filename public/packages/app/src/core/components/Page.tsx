import { MenuRoute } from "../types/navigation";
import { Menu } from "./Layout/Menu";
import { PageCenter } from "./PageCenter";
import { PageContent } from "./PageContent";
import { TraceoLoading } from "./TraceoLoading";
import { PageHeader, PageHeaderProps } from "@traceo/ui";
import { FC } from "react";
import { conditionClass } from "../utils/classes";

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
    <div>
      {header && (
        <div className="w-full flex flex-col px-9 mt-9">
          <PageHeader {...header} className="pb-0" />
          {menuRoutes && <Menu routes={menuRoutes} />}
        </div>
      )}

      <div className={conditionClass(!!header, "px-9", "p-9")}>{children}</div>
    </div>
  );
};

Page.Content = PageContent;
