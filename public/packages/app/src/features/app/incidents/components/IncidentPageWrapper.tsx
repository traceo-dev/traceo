import { Page } from "../../../../core/components/Page";
import { useApplication } from "../../../../core/hooks/useApplication";
import { MenuRoute } from "../../../../core/types/navigation";
import { useAppDispatch } from "../../../../store";
import { loadIncident } from "../state/actions";
import {
  ArrowLeftOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  RightOutlined,
  StockOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { mapIncidentStatus } from "@traceo/types";
import { mapHeaderStatusIcon } from "./utils";

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
      href: "/app/:id/incidents/:iid/errors",
      label: `Errors`,
      badge: (
        <div className="bg-yellow-600 text-black text-xs border rounded-full px-2 font-semibold">
          {incident.errorsCount}
        </div>
      ),
      key: "errors",
      icon: <WarningOutlined />
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
              className="text-[9px] flex flex-row leading-3 gap-x-2 items-center cursor-pointer max-w-min"
            >
              <ArrowLeftOutlined />
              <span>INCIDENTS</span>
            </div>
            <div className="flex flex-col">
              <span>{incident.type}</span>
              <div className="flex flex-row items-center pt-2 text-xs">
                <span className="text-sm mr-1">{mapHeaderStatusIcon[incident.status]}</span>
                <span className="text-2xs">{mapIncidentStatus[incident.status]}</span>
                <RightOutlined className="text-[8px] px-2" />
                <span className="font-normal">{incident?.message}</span>
              </div>
            </div>
          </div>
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
