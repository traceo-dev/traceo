import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadIncident } from "../../../../features/app/incidents/state/actions";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "../../../../types/store";
import { IncidentHeader } from "../../../../features/app/incidents/components/IncidentHeader";
import AppPage from "../../components/AppPage";
import { MenuRoute } from "../../../../types/navigation";
import { Menu } from "../../../../core/components/Layout/Menu";
import { CommentOutlined, InfoCircleOutlined, StockOutlined } from "@ant-design/icons";
import { PageCenter } from "../../../../core/components/PageCenter";
import { TraceoLoading } from "../../../../core/components/TraceoLoading";

export const AppIncidentNavigationPage = ({ children }) => {
  const { iid } = useParams();
  const dispatch = useAppDispatch();
  const { incident, hasFetched } = useSelector((state: StoreState) => state.incident);

  const menu: MenuRoute[] = [
    {
      href: "/app/:id/incidents/:iid/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/app/:id/incidents/:iid/analytics",
      label: "Analytics",
      key: "analytics",
      icon: <StockOutlined />
    },
    {
      href: "/app/:id/incidents/:iid/conversation",
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

  if (!hasFetched) {
    return (
      <PageCenter>
        <TraceoLoading />
      </PageCenter>
    );
  }

  return (
    <AppPage>
      <IncidentHeader incident={incident} onExecute={fetchIncident} />
      <Menu routes={menu} />
      {children}
    </AppPage>
  );
};

export default AppIncidentNavigationPage;
