import { TraceoLoading } from "./TraceoLoading";
import { FC } from "react";

/**
 * TODO: simple conditional rendering for now, later more styles here instead of in Page
 */
interface PageContentProps {
  isLoading?: boolean;
}
export const PageContent: FC<PageContentProps> = ({ children, isLoading }) => {
  return <div>{isLoading ? <TraceoLoading /> : children}</div>;
};
