import { MenuRoute } from "../types/navigation";
import { Menu } from "./Layout/Menu";
import { PageCenter } from "./PageCenter";
import { PageContent } from "./PageContent";
import { TraceoLoading } from "./TraceoLoading";
import { PageHeader, PageHeaderProps, conditionClass, joinClasses } from "@traceo/ui";
import { FC } from "react";

interface PageProps {
  menuRoutes?: MenuRoute[];
  header?: PageHeaderProps;
  headerDivider?: boolean;
  isLoading?: boolean;
}

interface PageType extends FC<PageProps> {
  Content: typeof PageContent;
}

export const Page: PageType = ({
  children,
  menuRoutes,
  header,
  headerDivider = false,
  isLoading = false
}) => {
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
        <div
          className={joinClasses(
            "w-full flex flex-col px-9 pt-9",
            conditionClass(headerDivider, "border-bottom")
          )}
        >
          <PageHeader {...header} />
          {menuRoutes && <Menu routes={menuRoutes} />}
        </div>
      )}

      {children}
    </div>
  );
};

Page.Content = PageContent;
