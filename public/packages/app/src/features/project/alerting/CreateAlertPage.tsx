import { Button, Row } from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertEnumType,
  AlertSeverity,
  AlertStatus,
  ApiResponse,
  Dictionary,
  IAlert,
  LogicOperator
} from "@traceo/types";
import api from "../../../core/lib/api";
import { AlertMutableForm } from "./AlertMutableForm";
import { RouterLink } from "../../../core/components/RouterLink";
import { Fragment } from "react";
import { Portal } from "src/core/components/Portal";
import { ToolbarButton } from "../overview/components/Toolbars/ToolbarButton";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const initialAlert: Partial<IAlert> = {
  type: AlertEnumType.INCIDENT,
  logicOperator: LogicOperator.ANY,
  rules: [],
  recipients: [],
  description: null,
  name: null,
  inAppNotification: true,
  emailNotification: false,
  severity: AlertSeverity.WARNING,
  minNotifyInterval: 5
};

const CreateAlertPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const onFinish = async (alert: Dictionary<any>) => {
    const resp: ApiResponse<unknown> = await api.post("/api/alert", {
      ...alert,
      status: AlertStatus.ACTIVE
    });
    if (resp.status === "success") {
      navigate(`/project/${id}/alerting`);
    }
  };

  return (
    <Fragment>
      <Portal id="dashboard-toolbar">
        <Row gap="x-3">
          <RouterLink to={`/project/${id}/alerting`}>
            <ToolbarButton icon={<CloseOutlined />} name="Cancel" className="bg-error text-white" />
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
        headerTitle="Alerting / Create"
        defaultValues={initialAlert}
        onSubmit={(alert) => onFinish(alert)}
      />
    </Fragment>
  );
};

export default CreateAlertPage;
