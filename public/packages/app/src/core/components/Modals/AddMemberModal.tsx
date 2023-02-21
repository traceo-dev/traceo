import { loadUsers } from "../../../features/admin/state/users/actions";
import { useAppDispatch } from "../../../store";
import { useApplication } from "../../hooks/useApplication";
import api from "../../lib/api";
import { StoreState } from "@store/types";
import { MemberRole } from "@traceo/types";
import { Select, FormItem, Button, ButtonContainer, Space, Avatar, Modal } from "@traceo/ui";
import { useEffect, useState, FormEvent } from "react";
import { useSelector } from "react-redux";

export const AddMemberModal = ({ isOpen, onCancel }) => {
  const dispatch = useAppDispatch();

  const { users, hasFetched } = useSelector((state: StoreState) => state.users);
  const { application } = useApplication();
  const { members } = useSelector((state: StoreState) => state.members);

  const [role, setRole] = useState<MemberRole>(null);
  const [userId, setUserId] = useState<string>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(loadUsers());
  }, []);

  const onFinish = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    await api
      .post("/api/member/application/add", {
        userId,
        role: role,
        applicationId: application.id
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
                isLoading={!hasFetched}
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
