import { InfoCircleOutlined, RightOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../../../../core/components/Page";
import { PreviewPageHeader } from "../../../../core/components/PreviewPageHeader";
import { MenuRoute } from "../../../../core/types/navigation";
import { loadAlert } from "../state/actions";
import { useAppDispatch } from "../../../../store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { Button } from "@traceo/ui";
import api from "../../../../core/lib/api";
import { Confirm } from "../../../../core/components/Confirm";
import { ApiResponse } from "@traceo/types";
import { mapSeverityToSpan } from "../utils";
import { RouterLink } from "../../../../core/components/RouterLink";

const AlertPageWrapper = ({ children }) => {
  const { id, aid } = useParams();
  const { alert, isLoading } = useSelector((state: StoreState) => state.alert);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const menu: MenuRoute[] = [
    {
      href: "/project/:id/alerting/:aid/details",
      label: "Details",
      key: "details",
      icon: <InfoCircleOutlined />
    },
    {
      href: "/project/:id/alerting/:aid/history",
      label: "History",
      key: "history",
      icon: <UnorderedListOutlined />
    }
  ];

  useEffect(() => {
    dispatch(loadAlert(aid));
  }, []);

  const onDelete = async () => {
    const response: ApiResponse<unknown> = await api.delete(`/api/alert/${aid}`);
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
              <div className="flex flex-row items-center pt-2 text-xs">
                <span className="text-sm mr-1">{mapSeverityToSpan[alert?.severity]}</span>
                {alert?.description && (
                  <>
                    <RightOutlined className="text-[8px] px-2" />
                    <span className="font-normal">{alert?.description}</span>
                  </>
                )}
              </div>
            }
          />
        ),
        suffix: (
          <div className="flex flex-row gap-x-3">
            <RouterLink to={`/project/${id}/alerting/${aid}/edit`}>
              <Button>Edit</Button>
            </RouterLink>
            <Confirm
              onOk={onDelete}
              description="Are you sure that you want to remove this alert?"
            >
              <Button variant="danger">Delete</Button>
            </Confirm>
          </div>
        )
      }}
      menuRoutes={menu}
      isLoading={isLoading}
    >
      <Page.Content>{children}</Page.Content>
    </Page>
  );
};

export default AlertPageWrapper;
