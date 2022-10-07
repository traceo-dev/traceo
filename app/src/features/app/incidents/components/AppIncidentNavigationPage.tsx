import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadIncident } from "../../../../features/app/incidents/state/actions";
import { useSelector } from "react-redux";
import { dispatch } from "../../../../store/store";
import { StoreState } from "../../../../types/store";
import { IncidentHeader } from "../../../../features/app/incidents/components/IncidentHeader";
import AppPage from "../../components/AppPage";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { MenuRoute } from "../../../../types/navigation";
import { Menu } from "../../../../core/components/Layout/Menu";
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
