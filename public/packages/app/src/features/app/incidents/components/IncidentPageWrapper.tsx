import { Page } from "../../../../core/components/Page";
import { useApplication } from "../../../../core/hooks/useApplication";
import { MenuRoute } from "../../../../core/types/navigation";
import { joinClasses } from "../../../../core/utils/classes";
import { useAppDispatch } from "../../../../store";
import { loadIncident } from "../state/actions";
import { mapIncidentStatusIcon, mapIncidentTwTextColor } from "./utils";
import {
  ArrowLeftOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  StockOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const IncidentPageWrapper = ({ children }) => {
  const { iid } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { application } = useApplication();
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

  const onBack = () => {
    navigate(`/app/${application.id}/incidents`);
  };

  return (
    <Page
      header={{
        title: (
          <div className="flex flex-col">
            <div
              onClick={() => onBack()}
              className="flex flex-row text-xs gap-x-2 items-center cursor-pointer max-w-min"
            >
              <ArrowLeftOutlined />
              <span className="text-2xs">INCIDENTS</span>
            </div>
            <div className="flex flex-row items-center">
              <span>{incident.type}</span>
              <div
                className={joinClasses(mapIncidentTwTextColor[incident.status], "ml-2 text-md")}
              >
                {mapIncidentStatusIcon[incident.status]}
              </div>
            </div>
          </div>
        ),
        description: incident?.message,
        // icon: <BugOutlined />,
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
