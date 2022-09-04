import { useEffect } from "react";
import { loadAccount } from "src/features/auth/state/actions";
import { dispatch } from "src/store/store";
import { MenuRoute } from "src/types/navigation";
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
    // {
    //   key: "usage",
    //   href: "/dashboard/usage",
    //   label: "Usage"
    // },
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Settings"
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
