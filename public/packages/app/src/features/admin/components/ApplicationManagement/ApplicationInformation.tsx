import { ColumnSection } from "../../../../core/components/ColumnSection";
import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import dateUtils from "../../../../core/utils/date";
import { LeftOutlined } from "@ant-design/icons";
import { ApiResponse, IApplication } from "@traceo/types";
import { Space, Button, Card, FieldLabel, Input } from "@traceo/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  application: IApplication;
}
export const ApplicationInformation = ({ application }: Props) => {
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onRemove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/${application.id}`)
      .then((resp) => {
        if (resp.status === "success") {
          navigate("/dashboard/admin/apps");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  const renderButtons = () => {
    return (
      <Space className="w-full justify-end">
        <Confirm
          auth={true}
          description="Are you sure that you want to remove this app?"
          onOk={() => onRemove()}
        >
          <Button variant="danger" loading={loadingDelete}>
            Remove app
          </Button>
        </Confirm>
      </Space>
    );
  };

  return (
    <Card
      icon={
        <LeftOutlined
          onClick={() => navigate(-1)}
          className="px-2 py-1 hover:bg-secondary cursor-pointer duration-200 rounded"
        />
      }
      title="Basic informations"
      extra={renderButtons()}
    >
      <ColumnSection subtitle="Basic information about the application. To edit his details, go to his settings on the dashboard.">
        <div className="flex flex-col w-2/3">
          <FieldLabel label="ID">
            <Input defaultValue={application?.id} disabled />
          </FieldLabel>
          <FieldLabel label="Name">
            <Input defaultValue={application?.name} disabled />
          </FieldLabel>
          <FieldLabel label="Last error at">
            <Input defaultValue={dateUtils.fromNow(application?.lastIncidentAt)} disabled />
          </FieldLabel>
          <FieldLabel label="Incidents count">
            <Input defaultValue={application?.incidentsCount} disabled />
          </FieldLabel>
          <FieldLabel label="Errors count">
            <Input defaultValue={application?.errorsCount} disabled />
          </FieldLabel>
        </div>
      </ColumnSection>
    </Card>
  );
};
