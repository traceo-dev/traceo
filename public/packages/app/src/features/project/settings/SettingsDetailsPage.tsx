import { ColumnSection } from "../../../core/components/ColumnSection";
import { Confirm } from "../../../core/components/Confirm";
import { Permissions } from "../../../core/components/Permissions";
import { useProject } from "../../../core/hooks/useProject";
import { useDemo } from "../../../core/hooks/useDemo";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { useAppDispatch } from "../../../store";
import { ApiKeySection } from "./components/ApiKeySection";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import { ApiResponse, MemberRole } from "@traceo/types";
import { Space, Button, Card, FieldLabel, Input, InputGroup, Row } from "@traceo/ui";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAplication } from "../state/project/actions";
import { BaseProjectViewType } from "src/core/types/hoc";

export const SettingsDetailsPage = ({ project, permission }: BaseProjectViewType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isDemo = useDemo();
  const ref = useRef<HTMLInputElement>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [isNameEdit, setNameEdit] = useState<boolean>(false);

  const isViewer = permission === MemberRole.VIEWER;

  const onUpdateName = () => {
    const name = ref.current.value;
    if (!name) {
      notify.error("Project name cannot be empty.");
      return;
    }

    dispatch(updateAplication({ name }));
    setNameEdit(false);
  };

  const remove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/project/${project.id}`)
      .then((response) => {
        if (response.status === "success") {
          navigate("/dashboard/projects");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  const renderEditNameButtons = () => {
    if (isViewer || isDemo) {
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
        <ColumnSection subtitle="Basic information about the project. Only users managing the project have the ability to edit its resources.">
          <div className="w-2/3 flex flex-col">
            <FieldLabel label="ID">
              <Input defaultValue={project?.id} disabled={true} />
            </FieldLabel>
            <FieldLabel label="Name">
              <InputGroup className="w-full gap-2">
                <Input
                  ref={ref}
                  className="w-full"
                  defaultValue={project?.name}
                  disabled={!isNameEdit}
                />
                {renderEditNameButtons()}
              </InputGroup>
            </FieldLabel>
            <FieldLabel label="SDK">
              <Row gap="x-2">
                <img src={`/img/svg/${project?.sdk}.svg`} width={15} alt={project?.sdk} />
                <span className="capitalize">{project?.sdk}</span>
              </Row>
            </FieldLabel>
          </div>
        </ColumnSection>
      </Card>
      <Permissions statuses={[MemberRole.MAINTAINER, MemberRole.ADMINISTRATOR]}>
        <ApiKeySection />
      </Permissions>
      <Permissions statuses={[MemberRole.ADMINISTRATOR]}>
        <Card title="Danger zone">
          <ColumnSection
            title={<span className="text-red-600 font-semibold">Delete project</span>}
            subtitle="Note that the removal of the project is immediate and irreversible. Only members with `Administrator` role can perform this operation."
          >
            <Space className="w-full mb-5">
              <Confirm
                auth={true}
                description="Are you sure that you want to remove this project?"
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

export default SettingsDetailsPage;
