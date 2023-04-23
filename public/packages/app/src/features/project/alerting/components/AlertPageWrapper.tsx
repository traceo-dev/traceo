import { InfoCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "src/core/components/Page";
import { PreviewPageHeader } from "src/core/components/PreviewPageHeader";
import { MenuRoute } from "src/core/types/navigation";
import { loadAlert } from "../state/actions";
import { useAppDispatch } from "../../../../store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { Button } from "@traceo/ui";
import api from "src/core/lib/api";
import { Confirm } from "src/core/components/Confirm";
import { ApiResponse } from "@traceo/types";

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

  const onEdit = () => {
    navigate(`/project/${id}/alerting/${aid}/edit`);
  };

  return (
    <Page
      header={{
        title: (
          <PreviewPageHeader
            page="alerting"
            title={alert?.name}
            description={alert?.description}
          />
        ),
        suffix: (
          <div className="flex flex-row gap-x-3">
            <Button onClick={onEdit}>Edit</Button>
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
