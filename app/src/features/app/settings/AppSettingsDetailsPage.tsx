import { Space } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ColumnSection } from "../../../core/components/ColumnSection";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";
import api from "../../../core/lib/api";
import { dispatch } from "../../../store/store";
import { ApiResponse } from "../../../types/api";
import { StoreState } from "../../../types/store";
import { MemberRole } from "../../../types/application";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../core/components/Confirm";
import { Permissions } from "../../../core/components/Permissions";
import { DescriptionInputRow, Descriptions } from "../../../core/components/Descriptions";
import { slugifyForUrl } from "../../../core/utils/stringUtils";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { notify } from "../../../core/utils/notify";
import { ApiKeySection } from "./components/ApiKeySection";
import { updateAplication } from "../state/application/actions";
import { Button } from "core/ui-components/Button/Button";
import { Typography } from "core/ui-components/Typography/Typography";
import { Card } from "core/ui-components/Card/Card";

export const AppSettingsDetailsPage = () => {
  const navigate = useNavigate();
  const { isViewer } = useMemberRole();
  const { application } = useSelector((state: StoreState) => state.application);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  if (!application) {
    return null;
  }

  const onUpdateName = (name: string) => {
    if (!name) {
      notify.error("Application name cannot be empty.");
      return;
    }

    dispatch(updateAplication({ name }));

    window.location.href = `/app/${application.id}/${slugifyForUrl(
      name
    )}/settings/details`;
  };

  const remove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/${application.id}`)
      .then((response) => {
        if (response.status === "success") {
          navigate("/dashboard/overview");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  return (
    <AppSettingsNavigationPage>
      <Card title="Basic Informations">
        <Descriptions>
          <DescriptionInputRow label="ID" editable={false}>
            <Typography>{application?.id}</Typography>
          </DescriptionInputRow>
          <DescriptionInputRow label="Name" onUpdate={onUpdateName} editable={!isViewer}>
            {application?.name}
          </DescriptionInputRow>
          <DescriptionInputRow label="Created by" editable={false}>
            <span>
              {application?.owner?.name}
              {application?.owner?.email && application?.owner?.email}
            </span>
          </DescriptionInputRow>
        </Descriptions>
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
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDetailsPage;
