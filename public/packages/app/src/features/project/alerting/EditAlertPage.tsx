import { Row } from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { ApiResponse, Dictionary } from "@traceo/types";
import { loadAlert } from "./state/actions";
import { useAppDispatch } from "../../../store";
import { StoreState } from "../../../store/types";
import { useSelector } from "react-redux";
import api from "../../../core/lib/api";
import { AlertMutableForm } from "./AlertMutableForm";
import { RouterLink } from "../../../core/components/RouterLink";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Portal } from "src/core/components/Portal";
import { ToolbarButton } from "../overview/components/Toolbars/ToolbarButton";

const EditAlertPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id, alertId } = useParams();
  const { alert } = useSelector((state: StoreState) => state.alert);

  useEffect(() => {
    dispatch(loadAlert(alertId));
  }, []);

  const onFinish = async (alertProps: Dictionary<any>) => {
    const resp: ApiResponse<unknown> = await api.patch(`/api/alert/${alertId}`, {
      ...alertProps,
      status: alert.status
    });
    if (resp.status === "success") {
      navigate(`/project/${id}/alerting/${alertId}/details`);
    }
  };

  return (
    <Fragment>
      <Portal id="dashboard-toolbar">
        <Row gap="x-3">
          <RouterLink to={`/project/${id}/alerting/${alert?.id}/details`}>
            <ToolbarButton
              icon={<CloseOutlined />}
              name="Cancel"
              className="bg-error text-white"
            />
          </RouterLink>

          <ToolbarButton
            type="submit"
            form="alert-form"
            icon={<CheckOutlined />}
            name="Save"
            className="bg-cyan-600 text-white"
          />
        </Row>
      </Portal>
      <AlertMutableForm
        headerTitle="Alerting / Edit"
        defaultValues={alert}
        onSubmit={(alert) => onFinish(alert)}
      />
    </Fragment>
  );
};

export default EditAlertPage;
