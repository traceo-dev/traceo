import { Button, Space } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import { TRY_AGAIN_LATER_ERROR } from "../../../../core/utils/constants";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../../core/components/Confirm";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import api from "../../../../core/lib/api";
import { notify } from "../../../../core/utils/notify";
import { handleStatus } from "../../../../core/utils/response";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { StoreState } from "../../../../types/store";
import { loadServerApplication } from "../../state/applications/actions";
import dateUtils from "core/utils/date";

export const ApplicationInformation = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.serverApplications);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onUpdate = async (name: string) => {
    try {
      await api.patch("/api/application", {
        id: application.id,
        name
      });
      dispatch(loadServerApplication(application.id));
      notify.success("Application updated.");
    } catch (error) {
      notify.error(TRY_AGAIN_LATER_ERROR);
    }
  };

  const onRemove = async () => {
    setLoadingDelete(true);
    try {
      const response: ApiResponse<string> = await api.delete(
        `/api/application/${application.id}`
      );
      if (handleStatus(response.status) === "success") {
        notify.success("App successfully deleted");
        navigate("/dashboard/management/apps");
      } else {
        notify.error(TRY_AGAIN_LATER_ERROR);
      }
    } catch (error) {
      notify.error(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const OperationButtons = () => {
    return (
      <Space className="w-full justify-end">
        <Confirm
          withAuth={true}
          description="Are you sure that you want to remove this app?"
          onOk={() => onRemove()}
        >
          <Button type="primary" loading={loadingDelete} danger>
            Remove app
          </Button>
        </Confirm>
      </Space>
    );
  };

  return (
    <>
      <PagePanel title="Basic Information" extra={<OperationButtons />}>
        <Descriptions>
          <DescriptionInputRow label="Name" onUpdate={onUpdate}>
            {application.name}
          </DescriptionInputRow>
          <DescriptionInputRow label="Last error at">
            {dateUtils.fromNow(application.lastIncidentAt)}
          </DescriptionInputRow>
          <DescriptionInputRow label="Incidents count">
            {application.incidentsCount}
          </DescriptionInputRow>
          <DescriptionInputRow label="Errors count">
            {application.errorsCount}
          </DescriptionInputRow>
        </Descriptions>
      </PagePanel>
    </>
  );
};
