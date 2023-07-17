import { joinClasses } from "@traceo/ui";
import { TraceoLoading } from "./TraceoLoading";
import { FC } from "react";

interface PageContentProps {
  isLoading?: boolean;
  className?: string;
}
export const PageContent: FC<PageContentProps> = ({ children, isLoading, className = "" }) => {
  return (
    <div className={joinClasses(className, "py-6 px-9")}>
      {isLoading ? <TraceoLoading /> : children}
    </div>
  );
};
