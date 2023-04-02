import { Page } from "../../../../core/components/Page";
import { MenuRoute } from "../../../../core/types/navigation";
import { useAppDispatch } from "../../../../store";
import { loadIncident } from "../state/actions";
import {
  CommentOutlined,
  InfoCircleOutlined,
  RightOutlined,
  StockOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { mapIncidentStatus } from "@traceo/types";
import { mapHeaderStatusIcon } from "./utils";
import { PageHeader } from "@traceo/ui";
import { PreviewPageHeader } from "src/core/components/PreviewPageHeader";

export const IncidentPageWrapper = ({ children }) => {
  const { iid } = useParams();
  const dispatch = useAppDispatch();
  const { incident, hasFetched } = useSelector((state: StoreState) => state.incident);

  const menu: MenuRoute[] = [
    {
      href: "/project/:id/incidents/:iid/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/project/:id/incidents/:iid/analytics",
      label: "Analytics",
      key: "analytics",
      icon: <StockOutlined />
    },
    {
      href: "/project/:id/incidents/:iid/events",
      label: "Events",
      badge: (
        <div className="bg-yellow-600 text-black text-xs border rounded-full px-2 font-semibold">
          {incident.eventsCount}
        </div>
      ),
      key: "events",
      icon: <WarningOutlined />
    },
    {
      href: "/project/:id/incidents/:iid/conversation",
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
          <PreviewPageHeader
            page="incident"
            title={incident.name}
            description={
              <div className="flex flex-row items-center pt-2 text-xs">
                <span className="text-sm mr-1">{mapHeaderStatusIcon[incident.status]}</span>
                <span className="text-2xs">{mapIncidentStatus[incident.status]}</span>
                <RightOutlined className="text-[8px] px-2" />
                <span className="font-normal">{incident?.message}</span>
              </div>
            }
          />
        )
      }}
      menuRoutes={menu}
      isLoading={!hasFetched}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

export default IncidentPageWrapper;
