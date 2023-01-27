import { Space } from "core/ui-components/Space";
import { useRef, useState } from "react";
import { ColumnSection } from "../../../core/components/ColumnSection";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import api from "../../../core/lib/api";
import { useAppDispatch } from "../../../store";
import { ApiResponse } from "../../../types/api";
import { MemberRole } from "../../../types/application";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../core/components/Confirm";
import { Permissions } from "../../../core/components/Permissions";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { notify } from "../../../core/utils/notify";
import { ApiKeySection } from "./components/ApiKeySection";
import { updateAplication } from "../state/application/actions";
import { Button } from "core/ui-components/Button";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { FieldLabel } from "core/ui-components/Form/FieldLabel";
import { Input } from "core/ui-components/Input";
import { InputGroup } from "core/ui-components/Input/InputGroup";
import { useApplication } from "core/hooks/useApplication";

export const AppSettingsDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isViewer } = useMemberRole();
  const { application } = useApplication();
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [isNameEdit, setNameEdit] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>();

  const onUpdateName = () => {
    const name = ref.current.value;
    if (!name) {
      notify.error("Application name cannot be empty.");
      return;
    }

    dispatch(updateAplication({ name }));
    setNameEdit(false);

    // window.location.href = `/app/${application.id}/settings/details`;
  };

  const remove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/applications/${application.id}`)
      .then((response) => {
        if (response.status === "success") {
          navigate("/dashboard/overview");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  const renderEditNameButtons = () => {
    if (isViewer) {
      return null;
    }

    if (!isNameEdit) {
      return (
        <Button size="xs" onClick={() => setNameEdit(true)}>
          Edit
        </Button>
      );
    }

    return (
      <>
        <Button size="xs" onClick={onUpdateName}>
          Save
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setNameEdit(false)}>
          Cancel
        </Button>
      </>
    );
  };

  return (
    <SettingsPageWrapper>
      <Card title="Basic Informations">
        <ColumnSection subtitle="Basic information about the application. Only users managing the application have the ability to edit its resources.">
          <div className="w-2/3 flex flex-col">
            <FieldLabel label="Application ID">
              <Input defaultValue={application?.id} disabled={true} />
            </FieldLabel>
            <FieldLabel label="Name">
              <InputGroup className="w-full gap-2">
                <Input
                  ref={ref}
                  className="w-full"
                  defaultValue={application?.name}
                  disabled={!isNameEdit}
                />
                {renderEditNameButtons()}
              </InputGroup>
            </FieldLabel>
            <FieldLabel label="Created by">
              <Input defaultValue={application?.owner?.name} disabled={true} />
            </FieldLabel>
          </div>
        </ColumnSection>
      </Card>
      <Permissions statuses={[MemberRole.ADMINISTRATOR]}>
        <ApiKeySection />
      </Permissions>
      <Permissions statuses={[MemberRole.ADMINISTRATOR]}>
        <Card title="Danger zone">
          <ColumnSection
            title={
              <Typography size="xl" weight="semibold" className="text-red-700">
                Delete app
              </Typography>
            }
            subtitle="Note that the removal of the application is immediate and irreversible. Only members with `Administrator` role can perform this operation."
          >
            <Space className="w-full mb-5">
              <Confirm
                auth={true}
                description="Are you sure that you want to remove this app?"
                onOk={() => remove()}
              >
                <Button variant="danger" loading={loadingDelete}>
                  Delete
                </Button>
              </Confirm>
            </Space>
          </ColumnSection>
        </Card>
      </Permissions>
    </SettingsPageWrapper>
  );
};

export default AppSettingsDetailsPage;
