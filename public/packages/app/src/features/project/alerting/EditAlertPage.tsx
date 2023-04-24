import { Button } from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ApiResponse, Dictionary } from "@traceo/types";
import { loadAlert } from "./state/actions";
import { useAppDispatch } from "../../../store/index";
import { StoreState } from "@store/types";
import { useSelector } from "react-redux";
import api from "src/core/lib/api";
import { AlertMutableForm } from "./AlertMutableForm";

const EditAlertPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id, aid } = useParams();
  const { alert } = useSelector((state: StoreState) => state.alert);

  useEffect(() => {
    dispatch(loadAlert(aid));
  }, []);

  const onFinish = async (alertProps: Dictionary<any>) => {
    const resp: ApiResponse<unknown> = await api.patch(`/api/alert/${aid}`, {
      ...alertProps,
      status: alert.status
    });
    if (resp.status === "success") {
      navigate(`/project/${id}/alerting/${aid}/details`);
    }
  };

  return (
    <AlertMutableForm
      headerTitle="Alerting / Edit"
      defaultValues={alert}
      onSubmit={(alert) => onFinish(alert)}
      headerSuffix={
        <div className="flex flex-row gap-x-3">
          <Button
            variant="danger"
            onClick={() => navigate(`/project/${id}/alerting/${alert?.id}/details`)}
          >
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

export default EditAlertPage;
