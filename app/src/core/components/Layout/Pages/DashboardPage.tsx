import { useEffect } from "react";
import { loadAccount } from "../../../../features/auth/state/actions";
import { dispatch } from "../../../../store/store";
import { MenuRoute } from "../../../../types/navigation";
import { Page } from "../../Page";
import Header from "../Header";

export const DashboardPage = ({ children }) => {
  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  const routes: MenuRoute[] = [
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview"
    },
    {
      key: "management",
      href: "/dashboard/management/accounts",
      label: "Management"
    },
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account"
    },
    {
      key: "updates",
      href: "/dashboard/updates",
      label: "Updates"
    }
  ];

  return (
    <>
      <Header routes={routes} />
      <Page className="px-12">{children}</Page>
    </>
  );
};
