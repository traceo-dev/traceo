import { FC, useState, FormEvent } from "react";
import { useRequest } from "../../hooks/useRequest";
import { Application, MemberRole } from "../../../types/application";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import api from "../../lib/api";
import { Select } from "core/ui-components/Select";
import { FormItem } from "core/ui-components/Form/FormItem";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Button } from "core/ui-components/Button";
import { Space } from "core/ui-components/Space";
import { Avatar } from "core/ui-components/Avatar";
import { Modal } from "core/ui-components/Modal";

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
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [application, setApplication] = useState<string>(null);
  const [role, setRole] = useState<MemberRole>(MemberRole.VIEWER);

  const [loading, setLoading] = useState<boolean>(false);

  const { data: applications = [], isLoading } = useRequest<Application[]>({
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
      .post("/api/amr/application/add", {
        accountId: account.id,
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
    <>
      <Modal title="Add to application" open={isOpen} onCancel={onCancel}>
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
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
              <Select
                value={role}
                options={roleOptions}
                onChange={(opt) => setRole(opt?.value)}
              />
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
    </>
  );
};
