import { ColumnSection } from "../../../../core/components/ColumnSection";
import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import dateUtils from "../../../../core/utils/date";
import { ApiResponse, IProject } from "@traceo/types";
import { Space, Button, Card, FieldLabel, Input } from "@traceo/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  project: IProject;
}
export const AdminProjectInformation = ({ project }: Props) => {
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onRemove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/project/${project.id}`)
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
          description="Are you sure that you want to remove this project?"
          onOk={() => onRemove()}
        >
          <Button variant="danger" loading={loadingDelete}>
            Remove project
          </Button>
        </Confirm>
      </Space>
    );
  };

  return (
    <Card title="Basic informations" extra={renderButtons()}>
      <ColumnSection subtitle="Basic information about the project. To edit his details, go to his settings on the dashboard.">
        <div className="flex flex-col w-2/3">
          <FieldLabel label="ID">
            <Input defaultValue={project?.id} disabled />
          </FieldLabel>
          <FieldLabel label="Name">
            <Input defaultValue={project?.name} disabled />
          </FieldLabel>
          <FieldLabel label="Last event at">
            <Input defaultValue={dateUtils.fromNow(project?.lastEventAt)} disabled />
          </FieldLabel>
          <FieldLabel label="Incidents count">
            <Input defaultValue={project?.incidentsCount} disabled />
          </FieldLabel>
        </div>
      </ColumnSection>
    </Card>
  );
};
