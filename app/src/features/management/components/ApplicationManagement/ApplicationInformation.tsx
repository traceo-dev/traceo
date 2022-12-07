import { Button, Space, Typography } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../../core/components/Confirm";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import api from "../../../../core/lib/api";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { StoreState } from "../../../../types/store";
import { updateServerApplication } from "../../state/applications/actions";
import dateUtils from "../../../../core/utils/date";

export const ApplicationInformation = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.serverApplications);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onUpdate = (name: string) => {
    dispatch(updateServerApplication(name));
  };

  const onRemove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/${application.id}`)
      .then((resp) => {
        if (resp.status === "success") {
          navigate("/dashboard/management/apps");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
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
          <DescriptionInputRow label="ID" editable={false}>
            <Typography.Text copyable>{application?.id}</Typography.Text>
          </DescriptionInputRow>
          <DescriptionInputRow label="Name" editable={true} onUpdate={onUpdate}>
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
