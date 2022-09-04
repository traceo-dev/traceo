import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadIncident } from "src/features/app/incidents/state/actions";
import { useSelector } from "react-redux";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { IncidentHeader } from "src/features/app/incidents/components/IncidentHeader";
import AppPage from "src/core/components/Layout/Pages/AppPage";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { MenuRoute } from "src/types/navigation";
import { Menu } from "src/core/components/Layout/Menu";
import { CommentOutlined, InfoCircleOutlined, StockOutlined } from "@ant-design/icons";

export const AppIncidentNavigationPage = ({ children }) => {
  const { iid } = useParams();
  const { incident, hasFetched } = useSelector((state: StoreState) => state.incident);

  const menu: MenuRoute[] = [
    {
      href: "/app/:id/:slug/incidents/:iid/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/app/:id/:slug/incidents/:iid/analytics",
      label: "Analytics",
      key: "analytics",
      icon: <StockOutlined />
    },
    {
      href: "/app/:id/:slug/incidents/:iid/conversation",
      label: "Conversation",
      key: "conversation",
      icon: <CommentOutlined />
    }
  ];

  useEffect(() => {
    fetchIncident();
  }, []);

  const fetchIncident = () => {
    dispatch(loadIncident(iid));
  };

  return (
    <AppPage>
      <ConditionLayout isLoading={!hasFetched}>
        <IncidentHeader incident={incident} onExecute={fetchIncident} />
        <Menu className="mt-5" routes={menu} />
        {children}
      </ConditionLayout>
    </AppPage>
  );
};

export default AppIncidentNavigationPage;
