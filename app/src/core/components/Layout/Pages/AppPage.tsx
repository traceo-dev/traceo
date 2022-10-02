import Header from "../Header";
import { Page } from "../../Page";
import { useEffect } from "react";
import { loadApplication } from "../../../../features/app/state/actions";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../../store/store";
import { MenuRoute } from "../../../../types/navigation";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { isEmptyObject } from "../../../../core/utils/object";
import NotFound from "./404";
import { PageCenter } from "../../PageCenter";
import { TraceoLoading } from "../../TraceoLoading";
import { isSlugCorrect } from "../../../../core/utils/url";

export const AppPage = ({ children }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { id } = useParams();

  useEffect(() => {
    dispatch(loadApplication(id));
  }, []);

  if (isEmptyObject(application)) {
    return <TraceoLoading />;
  } else if (!application?.member?.role || !isSlugCorrect(application.name)) {
    return (
      <PageCenter>
        <NotFound />
      </PageCenter>
    );
  }

  const routes: MenuRoute[] = [
    {
      key: "overview",
      href: "/app/:id/:slug/overview",
      label: "Overview"
    },
    {
      key: "incidents",
      href: "/app/:id/:slug/incidents",
      label: "Incidents"
    },
    {
      key: "explore",
      href: "/app/:id/:slug/explore/logs",
      label: "Explore"
    },
    {
      key: "members",
      href: "/app/:id/:slug/members",
      label: "Members"
    },
    {
      key: "settings",
      href: "/app/:id/:slug/settings/details",
      label: "Settings"
    }
  ];

  return (
    <>
      <Header routes={routes} />
      <Page className="px-12">{children}</Page>
    </>
  );
};

export default AppPage;
