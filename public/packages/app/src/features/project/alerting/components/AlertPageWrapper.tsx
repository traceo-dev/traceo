import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  RightOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../../../../core/components/Page";
import { PreviewPageHeader } from "../../../../core/components/PreviewPageHeader";
import { MenuRoute } from "../../../../core/types/navigation";
import { loadAlert } from "../state/actions";
import { useAppDispatch } from "../../../../store";
import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../store/types";
import { Button, Row } from "@traceo/ui";
import api from "../../../../core/lib/api";
import { Confirm } from "../../../../core/components/Confirm";
import { ApiResponse } from "@traceo/types";
import { mapSeverityToSpan } from "../utils";
import { RouterLink } from "../../../../core/components/RouterLink";
import { Portal } from "src/core/components/Portal";
import { ToolbarButton } from "../../overview/components/Toolbars/ToolbarButton";

const AlertPageWrapper = ({ children }) => {
  const { id, alertId } = useParams();
  const { alert, isLoading } = useSelector((state: StoreState) => state.alert);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const menu: MenuRoute[] = [
    {
      href: "/project/:id/alerting/:alertId/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/project/:id/alerting/:alertId/history",
      label: "History",
      key: "history",
      icon: <UnorderedListOutlined />
    }
  ];

  useEffect(() => {
    dispatch(loadAlert(alertId));
  }, []);

  const onDelete = async () => {
    const response: ApiResponse<unknown> = await api.delete(`/api/alert/${alertId}`);
    if (response.status === "success") {
      navigate(`/project/${id}/alerting`);
    }
  };

  return (
    <Page
      header={{
        title: (
          <PreviewPageHeader
            page="alerting"
            title={alert?.name}
            description={
              <Row className="pt-2 text-xs">
                <span className="text-sm mr-1">{mapSeverityToSpan[alert?.severity]}</span>
                {alert?.description && (
                  <Fragment>
                    <RightOutlined className="text-[8px] px-2" />
                    <span className="font-normal">{alert?.description}</span>
                  </Fragment>
                )}
              </Row>
            }
          />
        )
      }}
      menuRoutes={menu}
      isLoading={isLoading}
    >
      <Portal id="dashboard-toolbar">
        <Row gap="x-3">
          <Confirm onOk={onDelete} description="Are you sure that you want to remove this alert?">
            <ToolbarButton
              icon={<CloseOutlined />}
              name="Remove"
              className="bg-error text-white"
            />
          </Confirm>

          <RouterLink to={`/project/${id}/alerting/${alert.id}/edit`}>
            <ToolbarButton
              type="submit"
              form="alert-form"
              icon={<CheckOutlined />}
              name="Edit"
              className="bg-cyan-600 text-white"
            />
          </RouterLink>
        </Row>
      </Portal>
      <Page.Content className="pt-0">{children}</Page.Content>
    </Page>
  );
};

export default AlertPageWrapper;
