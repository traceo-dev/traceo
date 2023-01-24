import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { PageCenter } from "../../../core/components/PageCenter";
import React, { FC } from "react";
import { useApplication } from "core/hooks/useApplication";

interface Props {
  children: React.ReactNode;
  isLoading?: boolean;
}
const AppPage: FC<Props> = ({ children, isLoading }) => {
  const { application, hasFetched } = useApplication();
  const hasMemberRole = application?.member?.role;

  if (!application || !hasFetched || isLoading) {
    return (
      <PageCenter>
        <TraceoLoading />
      </PageCenter>
    );
  }

  if (application && !hasMemberRole) {
    return (
      <PageCenter>
        <NotFound />
      </PageCenter>
    );
  }

  return <div className="pb-5 pt-12">{children}</div>;
};

export default AppPage;
