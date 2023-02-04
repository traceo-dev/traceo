import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadIncident } from "../state/actions";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "@store/types";
import { MenuRoute } from "@traceo/types";
import {
  BugOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  StockOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Page } from "../../../../core/components/Page";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";

export const IncidentPageWrapper = ({ children }) => {
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
    dispatch(loadIncident(iid));
  }, []);

  return (
    <Page
      header={{
        title: (
          <div>
            <span>{incident.type}</span>
            <IncidentStatusTag className="ml-5" status={incident.status} />
          </div>
        ),
        description: incident?.message,
        icon: <BugOutlined />,
        suffix: (
          <SyncOutlined
            onClick={() => dispatch(loadIncident(iid))}
            className="text-xs cursor-pointer"
          />
        ),
        className: "mb-5"
      }}
      menuRoutes={menu}
      isLoading={!hasFetched}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

export default IncidentPageWrapper;
