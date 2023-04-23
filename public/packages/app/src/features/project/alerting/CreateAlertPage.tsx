import { Button } from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertEnumType,
  AlertSeverity,
  ApiResponse,
  Dictionary,
  IAlert,
  LogicOperator
} from "@traceo/types";
import api from "src/core/lib/api";
import { AlertMutableForm } from "./AlertMutableForm";

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
  minTimeInterval: 5
};

const CreateAlertPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const onFinish = async (alert: Dictionary<any>) => {
    const resp: ApiResponse<unknown> = await api.post("/api/alert", alert);
    if (resp.status === "success") {
      navigate(`/project/${id}/alerting`);
    }
  };

  return (
    <AlertMutableForm
      headerTitle="Alerting / Create"
      defaultValues={initialAlert}
      onSubmit={(alert) => onFinish(alert)}
      headerSuffix={
        <div className="flex flex-row gap-x-3">
          <Button variant="danger" onClick={() => navigate(`/project/${id}/alerting`)}>
            Cancel
          </Button>
          <Button type="submit" form="alert-form" variant="primary">
            Save
          </Button>
        </div>
      }
    />
  );
};

export default CreateAlertPage;
