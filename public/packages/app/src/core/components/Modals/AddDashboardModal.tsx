import { ApiResponse } from "@traceo/types";
import api from "../../lib/api";
import { FormItem, ButtonContainer, Button, Space, Modal, Form, Input } from "@traceo/ui";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "src/core/hooks/useProject";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}
export const AddDashboardModal: FC<Props> = ({ isOpen, onCancel }) => {
  const navigate = useNavigate();
  const { project } = useProject();

  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (props: { name: string }) => {
    setLoading(true);

    await api
      .post<ApiResponse<{ id: string }>>("/api/dashboard", {
        name: props.name,
        projectId: project.id
      })
      .then((response) => {
        if (response.status === "success") {
          const { id } = response.data;

          onCancel();
          navigate(`/project/${project.id}/dashboard/${id}`);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const onClose = () => {
    onCancel();
  };

  return (
    <Modal title="Create new dashboard" open={isOpen} onCancel={onCancel}>
      <Space direction="vertical" className="pt-0 px-4 w-full h-full justify-between text-center">
        <Form onSubmit={onFinish} id="add-dashboard-form">
          {({ register, errors }) => (
            <FormItem showRequiredMark={true} label="Name" error={errors.name}>
              <Input
                {...register("name", {
                  required: true
                })}
              />
            </FormItem>
          )}
        </Form>
        <ButtonContainer>
          <Button loading={loading} type="submit" form="add-dashboard-form">
            OK
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </Space>
    </Modal>
  );
};
