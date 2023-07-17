import { useProject } from "../../hooks/useProject";
import api from "../../lib/api";
import { StoreState } from "../../../store/types";
import { IUser, MemberRole } from "@traceo/types";
import { Select, FormItem, Button, ButtonContainer, Space, Avatar, Modal } from "@traceo/ui";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useReactQuery } from "../../../core/hooks/useReactQuery";

export const AddMemberModal = ({ isOpen, onCancel }) => {
  const { project } = useProject();
  const { members } = useSelector((state: StoreState) => state.members);

  const [role, setRole] = useState<MemberRole>(null);
  const [userId, setUserId] = useState<string>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const { data: users = [], isLoading } = useReactQuery<IUser[]>({
    queryKey: ["users"],
    url: "/api/users/search"
  });

  const onFinish = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    await api
      .post("/api/member/project/add", {
        userId,
        role: role,
        projectId: project.id
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  const onClose = () => {
    setUserId(null);
    setRole(null);
    onCancel();
  };

  const filterUsers = () => users.filter((u) => members.find((m) => m.userId !== u.id));

  const usersOptions = filterUsers().map((user) => ({
    icon: <Avatar size="sm" alt={user.name} src={user.gravatar} />,
    label: user.name,
    value: user.id,
    description: user?.email
  }));

  const roleOptions = Object.values(MemberRole).map((role) => ({
    label: role,
    value: role
  }));

  const onChangeRole = (role: MemberRole) => setRole(role);
  const onChangeUser = (userId: string) => setUserId(userId);

  return (
    <>
      <Modal title="Add member" onCancel={onClose} open={isOpen}>
        <Space direction="vertical" className="w-full">
          <form id="add-member-form" onSubmit={onFinish}>
            <FormItem label="User">
              <Select
                value={userId}
                onChange={(opt) => onChangeUser(opt?.value)}
                isLoading={isLoading}
                options={usersOptions}
              />
            </FormItem>
            <FormItem label="Role">
              <Select
                value={role}
                onChange={(opt) => onChangeRole(opt?.value)}
                options={roleOptions}
              />
            </FormItem>
          </form>

          <ButtonContainer className="float-left">
            <Button
              disabled={!role || !userId}
              loading={loading}
              type="submit"
              form="add-member-form"
            >
              OK
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ButtonContainer>
        </Space>
      </Modal>
    </>
  );
};
