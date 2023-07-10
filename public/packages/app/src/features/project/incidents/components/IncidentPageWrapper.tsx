import { Page } from "../../../../core/components/Page";
import { MenuRoute } from "../../../../core/types/navigation";
import {
  InfoCircleOutlined,
  RightOutlined,
  StockOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { mapIncidentStatus } from "@traceo/types";
import { mapHeaderStatusIcon } from "./utils";
import { PreviewPageHeader } from "../../../../core/components/PreviewPageHeader";
import { loadIncident } from "../state/actions";
import { useAppDispatch } from "../../../../store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useIncidentSelector } from "../../../../core/hooks/useIncidentSelector";
import { Row } from "@traceo/ui";

const menu: MenuRoute[] = [
  {
    href: "/project/:id/incidents/:incidentId/details",
    label: "Details",
    key: "details",
    icon: <InfoCircleOutlined />
  },
  {
    href: "/project/:id/incidents/:incidentId/analytics",
    label: "Analytics",
    key: "analytics",
    icon: <StockOutlined />
  },
  {
    href: "/project/:id/incidents/:incidentId/events",
    label: "Events",
    key: "events",
    icon: <WarningOutlined />
  }
];

const IncidentPageWrapper = ({ children }) => {
  const { incidentId } = useParams();
  const { incident, isLoading } = useIncidentSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadIncident(incidentId));
  }, []);

  return (
    <Page
      title={incident.name}
      header={{
        title: (
          <PreviewPageHeader
            page="incident"
            title={incident.name}
            description={
              <Row className="pt-2 text-xs">
                <span className="text-sm mr-1">{mapHeaderStatusIcon[incident.status]}</span>
                <span className="text-2xs">{mapIncidentStatus[incident.status]}</span>
                <RightOutlined className="text-[8px] px-2" />
                <span className="font-normal">{incident?.message}</span>
              </Row>
            }
          />
        )
      }}
      menuRoutes={menu}
      isLoading={isLoading}
    >
      <Page.Content className="pt-0">{children}</Page.Content>
    </Page>
  );
};

export default IncidentPageWrapper;
