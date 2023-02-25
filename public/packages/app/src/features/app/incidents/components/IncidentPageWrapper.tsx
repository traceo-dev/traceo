import { Page } from "../../../../core/components/Page";
import { useApplication } from "../../../../core/hooks/useApplication";
import { MenuRoute } from "../../../../core/types/navigation";
import { useAppDispatch } from "../../../../store";
import { loadIncident } from "../state/actions";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CommentOutlined,
  InfoCircleOutlined,
  StockOutlined,
  SyncOutlined,
  ThunderboltFilled,
  WarningFilled
} from "@ant-design/icons";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IncidentStatus } from "@traceo/types";
import { joinClasses } from "src/core/utils/classes";

const mainClassName = "p-3 rounded";
const mapHeaderStatusIcon: Record<IncidentStatus, JSX.Element> = {
  [IncidentStatus.RESOLVED]: (
    <CheckCircleFilled className={joinClasses("bg-green-800 text-green-100", mainClassName)} />
  ),
  [IncidentStatus.UNRESOLVED]: (
    <WarningFilled className={joinClasses("bg-red-800 text-red-100", mainClassName)} />
  ),
  [IncidentStatus.IN_PROGRESS]: (
    <ThunderboltFilled className={joinClasses("bg-purple-800 text-purple-100", mainClassName)} />
  )
};

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
          <div className="flex flex-row items-center">
            {mapHeaderStatusIcon[incident.status]}
            <div className="flex flex-col pl-5">
              <div
                onClick={() => onBack()}
                className="flex flex-row text-xs gap-x-2 items-center cursor-pointer max-w-min"
              >
                <ArrowLeftOutlined />
                <span className="text-2xs">INCIDENTS</span>
              </div>
              <div className="flex flex-col">
                <span>{incident.type}</span>
                <span className="text-xs font-normal">{incident?.message}</span>
              </div>
            </div>
          </div>
        ),
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
