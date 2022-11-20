import Header from "../../../core/components/Layout/Header";
import { Page } from "../../../core/components/Page";
import { useEffect } from "react";
import { loadApplication } from "../state/actions";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../store/store";
import { MenuRoute } from "../../../types/navigation";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { isEmptyObject } from "../../../core/utils/object";
import NotFound from "../../../core/components/Layout/Pages/404";
import { PageCenter } from "../../../core/components/PageCenter";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { isSlugCorrect } from "../../../core/utils/url";
import { useDemo } from "../../../core/hooks/useDemo";

export const AppPage = ({ children }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { id } = useParams();
  const { isDemo } = useDemo();

  useEffect(() => {
    dispatch(loadApplication(id));
  }, []);

  const hasMemberRole = application?.member?.role;
  const isCorrectClug = isSlugCorrect(application.name);

  if (isEmptyObject(application)) {
    return <TraceoLoading />;
  } else if (!hasMemberRole || !isCorrectClug) {
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
      label: "Explore",
      private: isDemo
    },
    {
      key: "metrics",
      href: "/app/:id/:slug/metrics",
      label: "Metrics",
      private: isDemo
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
      <Page>{children}</Page>
    </>
  );
};

export default AppPage;
