import { useRequest } from "../../hooks/useRequest";
import api from "../../lib/api";
import { StoreState } from "@store/types";
import { IProject, MemberRole } from "@traceo/types";
import { Select, FormItem, ButtonContainer, Button, Space, Avatar, Modal } from "@traceo/ui";
import { FC, useState, FormEvent } from "react";
import { useSelector } from "react-redux";

const roleOptions = Object.values(MemberRole).map((role) => ({
  label: role,
  value: role
}));

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  postExecute: () => void;
}
export const AddToApplicationModal: FC<Props> = ({ isOpen, onCancel, postExecute }) => {
  const { user } = useSelector((state: StoreState) => state.users);
  const [application, setApplication] = useState<string>(null);
  const [role, setRole] = useState<MemberRole>(MemberRole.VIEWER);

  const [loading, setLoading] = useState<boolean>(false);

  const { data: applications = [], isLoading } = useRequest<IProject[]>({
    url: "/api/applications/search",
    params: {
      order: "DESC",
      sortBy: "createdAt"
    }
  });

  const onFinish = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    await api
      .post("/api/member/application/add", {
        userId: user.id,
        applicationId: application,
        role: role
      })
      .finally(() => {
        postExecute();
        setLoading(false);
        onClose();
      });
  };

  const onClose = () => {
    setRole(MemberRole.VIEWER);
    setApplication(null);
    onCancel();
  };

  return (
    <Modal title="Add to application" open={isOpen} onCancel={onCancel}>
      <Space direction="vertical" className="pt-0 px-4 w-full h-full justify-between text-center">
        <form onSubmit={onFinish} id="add-to-application-form">
          <FormItem label="Application">
            <Select
              isLoading={isLoading}
              value={application}
              options={applications?.map((app) => ({
                label: app.name,
                value: app.id,
                icon: <Avatar size="sm" src={app?.gravatar} alt={app.name} />
              }))}
              onChange={(opt) => setApplication(opt?.value)}
            />
          </FormItem>
          <FormItem label="Role">
            <Select value={role} options={roleOptions} onChange={(opt) => setRole(opt?.value)} />
          </FormItem>
        </form>

        <ButtonContainer>
          <Button
            disabled={!role || !application}
            loading={loading}
            type="submit"
            form="add-to-application-form"
          >
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
